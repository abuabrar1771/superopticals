import productModel from "../models/productModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import invoiceModel from "../models/invoiceModel.js"; // 🌟 Added for in-store physical bills
import mongoose from "mongoose";

// Helper function to safely fetch the order model context dynamically
const getOrderModel = () => {
  return mongoose.models.order || mongoose.connection.model("order");
};

// ---------------------------------------------------------------------
// 1. LIVE INVENTORY MANAGER (FOR BOTH FRAMES & COMPLEX POWER VARIANTS)
// ---------------------------------------------------------------------
export const updateProductStock = async (req, res) => {
  try {
    const { productId, adjustmentAmount, isVariant, variantSku } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Optical product asset not found." });
    }

    if (isVariant && variantSku) {
      const variantIndex = product.variants.findIndex(v => v.sku === variantSku);
      if (variantIndex === -1) {
        return res.json({ success: false, message: "Specified eye power matrix SKU variant not found." });
      }

      const currentStock = product.variants[variantIndex].stock || 0;
      product.variants[variantIndex].stock = Math.max(0, currentStock + Number(adjustmentAmount));
    } else {
      const currentStock = product.stock || 0;
      product.stock = Math.max(0, currentStock + Number(adjustmentAmount));
    }

    await product.save();
    return res.json({
      success: true,
      message: "Inventory stock levels adjusted successfully.",
      product
    });
  } catch (error) {
    console.error("Stock Mutation Exception:", error);
    return res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------
// 2. LOW INVENTORY TRACKING ENGINE (WARNING SYSTEM)
// ---------------------------------------------------------------------
export const getLowStockInventory = async (req, res) => {
  try {
    const lowStockAlerts = await productModel.find({
      $or: [
        { 
          category: { $ne: "Lenses" }, 
          $expr: { $lte: ["$stock", "$minStockAlert"] } 
        },
        { 
          category: "Lenses", 
          "variants.stock": { $lte: 2 } 
        }
      ]
    }).select("sku name brand category stock minStockAlert variants");

    return res.json({ success: true, products: lowStockAlerts });
  } catch (error) {
    console.error("Inventory Fetch Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------
// 3. SECURE PATIENT EYE POWER ENTRY
// ---------------------------------------------------------------------
export const savePatientPrescription = async (req, res) => {
  try {
    const { 
      customerId, 
      patientName, 
      patientMobile, 
      rightEye, 
      leftEye, 
      lensType, 
      doctorName 
    } = req.body;

    if (!lensType) {
      return res.json({ success: false, message: "Lens type parameter is required to validate patient prescription." });
    }

    const cleanMobile = patientMobile.replace(/\s+/g, '').replace(/[-()]/g, '');
    const fullMobileNum = cleanMobile.startsWith('+91') ? cleanMobile : `+91${cleanMobile.replace(/^\+?91/, '')}`;

    const newPrescription = new prescriptionModel({
      customerId: customerId || null,
      patientName,
      patientMobile: fullMobileNum,
      rightEye: {
        sph: rightEye?.sph || "0.00",
        cyl: rightEye?.cyl || "0.00",
        axis: rightEye?.axis || "0",
        add: rightEye?.add || "0.00",
        pd: rightEye?.pd || ""
      },
      leftEye: {
        sph: leftEye?.sph || "0.00",
        cyl: leftEye?.cyl || "0.00",
        axis: leftEye?.axis || "0",
        add: leftEye?.add || "0.00",
        pd: leftEye?.pd || ""
      },
      lensType,
      doctorName: doctorName || "Self / In-Store"
    });

    await newPrescription.save();
    return res.json({ 
      success: true, 
      message: "Patient vision profile logged successfully under secure index record hooks." 
    });
  } catch (error) {
    console.error("Prescription Entry Mutation Failure:", error);
    return res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------
// 4. SEARCH CUSTOMER BY MOBILE NUMBER FOR RETAIL DESK (REGEX PROTECTED)
// ---------------------------------------------------------------------
export const searchCustomerByMobile = async (req, res) => {
  try {
    const { mobileNum } = req.query;
    if (!mobileNum) {
      return res.json({ success: false, message: "Search criteria query input is required." });
    }

    const searchStr = mobileNum.trim();

    // CRITICAL FIX: Escape special characters (like '+') to prevent MongoDB regex compilation crashes
    const escapedSearchStr = searchStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    // Create a phone formatting variant just in case they typed clear numbers
    const cleanMobile = searchStr.replace(/\s+/g, '').replace(/[-()]/g, '');
    const formattedPhoneVariant = cleanMobile.startsWith('+91') ? cleanMobile : `+91${cleanMobile.replace(/^\+?91/, '')}`;
    const escapedPhoneVariant = formattedPhoneVariant.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    // Safe Multi-Field Database Search Pipeline
    const customerMatches = await prescriptionModel.find({
      $or: [
        { patientName: { $regex: escapedSearchStr, $options: 'i' } },       // Case-insensitive match for name string
        { patientMobile: { $regex: escapedSearchStr, $options: 'i' } },     // Match raw characters typed
        { patientMobile: { $regex: escapedPhoneVariant, $options: 'i' } }   // Match country-code appended structures
      ]
    }).sort({ createdAt: -1 }); // Pull latest diagnostic files first
    
    if (customerMatches.length > 0) {
      // De-duplicate array items if a client has multiple previous invoice entries
      const uniquePatientsMap = [];
      const trackingArray = new Set();

      customerMatches.forEach(record => {
        if (!trackingArray.has(record.patientMobile)) {
          trackingArray.add(record.patientMobile);
          uniquePatientsMap.push(record);
        }
      });

      return res.json({
        success: true,
        exists: true,
        patientName: uniquePatientsMap[0].patientName, 
        history: uniquePatientsMap 
      });
    } else {
      return res.json({ success: true, exists: false, history: [], message: "New walk-in profile initialized." });
    }
  } catch (error) {
    console.error("Customer Lookup Exception:", error);
    return res.json({ success: false, message: error.message });
  }
};
// ---------------------------------------------------------------------
// 5. CREATE IN-STORE CUSTOM JOB INVOICE & AUTO-DEDUCT CORES
// ---------------------------------------------------------------------
export const createInStoreInvoice = async (req, res) => {
  try {
    const { 
      patientName, patientMobile, lensType, frameId, lensId,
      rightEye, leftEye, framePrice, lensPrice, discount, paymentMode, items
    } = req.body;

    const cleanMobile = patientMobile.replace(/\s+/g, '').replace(/[-()]/g, '');
    const fullMobileNum = cleanMobile.startsWith('+91') ? cleanMobile : `+91${cleanMobile.replace(/^\+?91/, '')}`;
    const generatedInvoiceNum = `INV-${Date.now().toString().slice(-6)}`;

    // A. STRATEGIC RUNTIME COMPILER: Support both updated unified array arrays and older single flat item configurations
    let processingItems = [];

    if (items && Array.isArray(items) && items.length > 0) {
      processingItems = items;
    } else {
      // Fallback object adapter if the incoming payload is in the single flat layout configuration
      processingItems = [{
        category: "EYE_GLASS",
        frameProduct: frameId || null,
        productName: "In-Store Item",
        framePrice: Number(framePrice || 0),
        lensType: lensType || "Standard Non-Powered / Plano",
        lensPrice: Number(lensPrice || 0),
        itemSubtotal: Number(framePrice || 0) + Number(lensPrice || 0),
        rightEyePower: rightEye || { sph: "0.00", cyl: "0.00", axis: "0", add: "0.00", pd: "60" },
        leftEyePower: leftEye || { sph: "0.00", cyl: "0.00", axis: "0", add: "0.00", pd: "60" }
      }];
    }

    // B. Calculate financials safely across all submitted line items
    const grossTotalCalculated = processingItems.reduce((acc, curr) => acc + Number(curr.itemSubtotal || 0), 0);
    const netTotalCalculated = Math.max(0, grossTotalCalculated - Number(discount || 0));

    // C. Process prescription logging only if an items cell contains valid ophthalmic parameters
    const prescriptionLineItem = processingItems.find(i => 
      i.category === 'EYE_GLASS' || i.category === 'POWERED_GLASS' || i.category === 'CONTACT_LENS'
    );

    if (prescriptionLineItem) {
      const selectedLensTypeString = prescriptionLineItem.lensType || lensType || "Standard Non-Powered";
      
      const newPrescription = new prescriptionModel({
        patientName,
        patientMobile: fullMobileNum,
        lensType: selectedLensTypeString,
        rightEye: {
          sph: String(prescriptionLineItem.rightEyePower?.sph || "0.00"),
          cyl: String(prescriptionLineItem.rightEyePower?.cyl || "0.00"),
          axis: String(prescriptionLineItem.rightEyePower?.axis || "0"),
          add: String(prescriptionLineItem.rightEyePower?.add || "0.00"),
          pd: String(prescriptionLineItem.rightEyePower?.pd || "60")
        },
        leftEye: {
          sph: String(prescriptionLineItem.leftEyePower?.sph || "0.00"),
          cyl: String(prescriptionLineItem.leftEyePower?.cyl || "0.00"),
          axis: String(prescriptionLineItem.leftEyePower?.axis || "0"),
          add: String(prescriptionLineItem.leftEyePower?.add || "0.00"),
          pd: String(prescriptionLineItem.leftEyePower?.pd || "60")
        },
        doctorName: "In-Store Optometrist"
      });
      await newPrescription.save();
    }

    // D. Log the final physical invoice transaction to MongoDB
    // Using dynamic primary variables extracted cleanly from the active processing queue array list
    const primaryRowItem = processingItems[0];

    const newInvoice = new invoiceModel({
      invoiceNumber: generatedInvoiceNum,
      patientName,
      patientMobile: fullMobileNum,
      
      // Map reference fields safely to protect nested parent sub-documents
      frameProduct: primaryRowItem.frameProduct || frameId || null,
      lensProduct: lensId || null,
      rightEyePower: primaryRowItem.rightEyePower || rightEye || { sph: "0.00", cyl: "0.00", axis: "0", add: "0.00", pd: "60" },
      leftEyePower: primaryRowItem.leftEyePower || leftEye || { sph: "0.00", cyl: "0.00", axis: "0", add: "0.00", pd: "60" },
      
      // Absolute fallback handler protects 'required: true' criteria against empty sunglasses lines
      lensType: primaryRowItem.lensType || lensType || "Plano / Standard Non-Powered",
      
      framePrice: Number(primaryRowItem.framePrice || framePrice || 0),
      lensPrice: Number(primaryRowItem.lensPrice || lensPrice || 0),
      discount: Number(discount || 0),
      totalAmount: netTotalCalculated,
      paymentMode: paymentMode || "Cash"
    });
    await newInvoice.save();

    // E. AUTO-DEDUCT STOCK PIPELINE: Loop and remove units safely from matching catalog products
    for (const item of processingItems) {
      const activeFrameId = item.frameProduct || frameId;
      if (activeFrameId && mongoose.Types.ObjectId.isValid(activeFrameId)) {
        await productModel.findByIdAndUpdate(activeFrameId, { $inc: { stock: -1 } });
      }

      const activeLensId = lensId; 
      const activeRightEye = item.rightEyePower || rightEye;
      const activeLeftEye = item.leftEyePower || leftEye;

      if (activeLensId && mongoose.Types.ObjectId.isValid(activeLensId) && activeRightEye && activeLeftEye) {
        // Deduct Right Lens variant stock level
        await productModel.findOneAndUpdate(
          { _id: activeLensId, "variants.specifications.sphere": activeRightEye.sph, "variants.specifications.cylinder": activeRightEye.cyl },
          { $inc: { "variants.$.stock": -1 } }
        );
        // Deduct Left Lens variant stock level
        await productModel.findOneAndUpdate(
          { _id: activeLensId, "variants.specifications.sphere": activeLeftEye.sph, "variants.specifications.cylinder": activeLeftEye.cyl },
          { $inc: { "variants.$.stock": -1 } }
        );
      }
    }

    return res.json({ 
      success: true, 
      message: `Invoice ${generatedInvoiceNum} created successfully! Inventory stock adjusted accordingly.`,
      invoiceNumber: generatedInvoiceNum,
      totalAmount: netTotalCalculated
    });

  } catch (error) {
    console.error("Retail Invoicing Processing Fault:", error);
    return res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------
// 6. METRIC DRIVEN DAILY INVOICE & CASH ACCOUNTING DATA
// ---------------------------------------------------------------------
export const getDailyAccountingMetrics = async (req, res) => {
  try {
    const Order = getOrderModel();
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const prescriptionsTodayCount = await prescriptionModel.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    let financialSummary = {
      totalInvoicesCount: 0,
      grossRevenueToday: 0,
      paymentMethodBreakdown: {
        cod: 0,
        stripe: 0,
        razorpay: 0,
        store_cash: 0, 
        store_upi: 0,  
        store_card: 0  
      },
      paymentStatusTotals: {
        paidRevenue: 0,
        unpaidRevenue: 0
      },
      prescriptionsFiledToday: prescriptionsTodayCount
    };

    // --- PIPELINE A: Aggregating Online Store Web Front-End Orders ---
    if (Order) {
      const activeInvoicesToday = await Order.find({
        createdAt: { $gte: startOfToday, $lte: endOfToday }
      });

      financialSummary.totalInvoicesCount += activeInvoicesToday.length;

      activeInvoicesToday.forEach(invoice => {
        const orderValue = Number(invoice.amount || invoice.totalAmount || 0);
        financialSummary.grossRevenueToday += orderValue;

        if (invoice.payment === true || invoice.paymentStatus === "Paid" || invoice.status === "Delivered") {
          financialSummary.paymentStatusTotals.paidRevenue += orderValue;
        } else {
          financialSummary.paymentStatusTotals.unpaidRevenue += orderValue;
        }

        const method = String(invoice.paymentMethod || invoice.method || "cod").toLowerCase();
        if (method.includes("stripe")) {
          financialSummary.paymentMethodBreakdown.stripe += orderValue;
        } else if (method.includes("razorpay")) {
          financialSummary.paymentMethodBreakdown.razorpay += orderValue;
        } else {
          financialSummary.paymentMethodBreakdown.cod += orderValue;
        }
      });
    }

    // --- PIPELINE B: Aggregating In-Store Physical Sales Invoices ---
    const retailInvoicesToday = await invoiceModel.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    financialSummary.totalInvoicesCount += retailInvoicesToday.length;

    retailInvoicesToday.forEach(bill => {
      const billValue = Number(bill.totalAmount || 0);
      financialSummary.grossRevenueToday += billValue;
      financialSummary.paymentStatusTotals.paidRevenue += billValue; 

      const mode = String(bill.paymentMode || 'Cash').toLowerCase();
      if (mode === 'upi') {
        financialSummary.paymentMethodBreakdown.store_upi += billValue;
      } else if (mode === 'card') {
        financialSummary.paymentMethodBreakdown.store_card += billValue;
      } else {
        financialSummary.paymentMethodBreakdown.store_cash += billValue;
      }
    });

    return res.json({ 
      success: true, 
      metrics: financialSummary 
    });
  } catch (error) {
    console.error("Financial Data Aggregation Failure:", error);
    return res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------
// 7. MASTER LIVE AUTOCOMPLETE SEARCH
// ---------------------------------------------------------------------
export const searchProductsAutocomplete = async (req, res) => {
  try {
    const { query, category } = req.query; 
    if (!query) {
      return res.json({ success: true, products: [] });
    }

    // Comprehensive multi-field regex match block
    const searchFilter = {
      $and: [
        {
          $or: [
            { brand: { $regex: query, $options: 'i' } },                
            { name: { $regex: query, $options: 'i' } },                 
            { sku: { $regex: query, $options: 'i' } },                  
            { "specifications.color": { $regex: query, $options: 'i' } },
            { "specifications.shape": { $regex: query, $options: 'i' } } 
          ]
        }
      ]
    };

    // Keep your category filtering layer running smoothly
    if (category) {
      if (category === "Lenses") {
        searchFilter.$and.push({ category: "Lenses" });
      } else {
        searchFilter.$and.push({ category: { $ne: "Lenses" } });
      }
    }

    // Limit to 8 matches to keep the UI super snappy
    const matchingProducts = await productModel.find(searchFilter).limit(8);
    return res.json({ success: true, products: matchingProducts });
  } catch (error) {
    console.error("Master autocomplete lookup breakdown:", error);
    return res.json({ success: false, message: error.message });
  }
};