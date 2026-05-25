import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Localized categories map tracking retail item variations
const categoryMap = {
  EYE_GLASS: ["Full-Rim", "Half-Rim", "Rimless", "Kids"],
  SUN_GLASS: ["Polarized", "Non-Polarized", "Mirrored", "Gradient"],
  UV_GLASS: ["Blue-Cut", "Anti-Glare", "UV400 Clear"],
  POWERED_GLASS: ["Single Vision", "Progressive", "Photochromic"],
  CONTACT_LENS: ["Daily", "Fortnightly", "Monthly", "Yearly"],
};

const StoreBilling = ({ backendUrl, token }) => {
  // Core Customer Autocomplete Search States
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
  const [customerSearchInput, setCustomerSearchInput] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [patientName, setPatientName] = useState('');
  const [pastHistory, setPastHistory] = useState([]);
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

  // MASTER INVOICE ITEMS ARRAY GRID STATE
  const [items, setItems] = useState([]);

  // ACTIVE CURRENT ITEM WORKSPACE PARAMETERS
  const [selectedProductCategory, setSelectedProductCategory] = useState('EYE_GLASS');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Full-Rim');
  const [frameInput, setFrameInput] = useState('');
  const [frameId, setFrameId] = useState('');
  const [framePrice, setFramePrice] = useState(0);
  const [selectedBrandAndName, setSelectedBrandAndName] = useState('');

  // Unified Database Collections States
  const [dbLensTypes, setDbLensTypes] = useState([]);
  const [dbLensFeatures, setDbLensFeatures] = useState([]);

  const [lensType, setLensType] = useState(''); 
  const [baseLensPrice, setBaseLensPrice] = useState(0);      
  const [selectedFeatures, setSelectedFeatures] = useState([]); 

  // Eye Power Matrix Configurations Workspace
  const defaultEyePower = { sph: '0.00', cyl: '0.00', axis: '0', add: '0.00', pd: '60' };
  const [rightEye, setRightEye] = useState({ ...defaultEyePower });
  const [leftEye, setLeftEye] = useState({ ...defaultEyePower });

  // Global Accounting pricing variables
  const [discount, setDiscount] = useState(0); 
  const [paymentMode, setPaymentMode] = useState('Cash');

  // Live Inventory Search States
  const [frameSuggestions, setFrameSuggestions] = useState([]);
  const [frameActiveIndex, setFrameActiveIndex] = useState(-1);
  const [customerActiveIndex, setCustomerActiveIndex] = useState(-1);

  const frameScrollRef = useRef(null);
  const customerScrollRef = useRef(null);

  const isPrescriptionRequired = 
    selectedProductCategory === 'EYE_GLASS' || 
    selectedProductCategory === 'POWERED_GLASS' ||
    selectedProductCategory === 'CONTACT_LENS';

  const isLensConfigRequired = 
    selectedProductCategory === 'EYE_GLASS' || 
    selectedProductCategory === 'POWERED_GLASS' ||
    selectedProductCategory === 'CONTACT_LENS';

  // Safely sync sub-categories without wiping out your frameInput field while typing
  useEffect(() => {
    const availableSubs = categoryMap[selectedProductCategory] || [];
    if (availableSubs.length > 0) {
      setSelectedSubCategory(availableSubs[0]);
    }

    if (!isLensConfigRequired) {
      setLensType('');
      setBaseLensPrice(0);
      setSelectedFeatures([]);
    } else {
      if (!lensType && dbLensTypes.length > 0) {
        setLensType(dbLensTypes[0].name);
        setBaseLensPrice(Number(dbLensTypes[0].price || 0));
      }
    }

    setFrameId('');
    setFramePrice(0);
    setFrameSuggestions([]);
  }, [selectedProductCategory]);

  useEffect(() => {
    if (isLensConfigRequired) {
      if (dbLensTypes.length > 0 && !lensType) {
        setLensType(dbLensTypes[0].name);
        setBaseLensPrice(Number(dbLensTypes[0].price || 0));
      }
    }
  }, [dbLensTypes, isLensConfigRequired]);

  // Matrix generation engines
  const generateSphCylOptions = () => {
    const options = [];
    for (let i = 14.00; i >= -14.00; i -= 0.25) {
      const formatted = i > 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
      options.push(formatted === '-0.00' ? '0.00' : formatted);
    }
    return [...new Set(options)];
  };

  const generateAxisOptions = () => {
    const options = ['0'];
    for (let i = 5; i <= 180; i += 5) options.push(String(i));
    return [...new Set(options)];
  };

  const generateAddOptions = () => {
    const options = [];
    for (let i = 0.00; i <= 4.00; i += 0.25) options.push(i.toFixed(2));
    return options;
  };

  const generatePdOptions = () => {
    const options = [];
    for (let i = 40; i <= 80; i++) options.push(String(i));
    return options;
  };

  const sphCylRanges = generateSphCylOptions();
  const axisRanges = generateAxisOptions();
  const addRanges = generateAddOptions();
  const pdRanges = generatePdOptions();

  useEffect(() => {
    const fetchLensConfigs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/lens/all`, { headers: { token } });
        const configsArray = response.data.data || [];

        if (configsArray.length > 0) {
          const typesField = configsArray.filter(item => item.category === 'LENS_TYPE');
          const featuresField = configsArray.filter(item => item.category === 'LENS_FEATURE');
          setDbLensTypes(typesField);
          setDbLensFeatures(featuresField);
        }
      } catch (err) {
        console.error("Lens configurations network error:", err.message);
      }
    };
    fetchLensConfigs();
  }, [backendUrl, token]);

  // customer search hook 
useEffect(() => {
  const delayDebounceFn = setTimeout(async () => {
    const query = customerSearchInput.trim();
    
    // Safety check: Only search if the shop owner typed something
    if (query.length >= 1) {
      try {
        // Send the raw query text to the server so it can check both names and numbers
        const res = await axios.get(
          `${backendUrl}/api/inventory/search-customer?mobileNum=${encodeURIComponent(query)}`, 
          { headers: { token } }
        );
        
        if (res.data.success && res.data.history) {
          setCustomerSuggestions(res.data.history);
          setCustomerActiveIndex(-1);
        } else {
          setCustomerSuggestions([]);
        }
      } catch (err) { 
        console.error("Patient autocomplete network lookup error:", err); 
        setCustomerSuggestions([]);
      }
    } else {
      setCustomerSuggestions([]);
    }
  }, 300); // 300ms debouncing delay
  
  return () => clearTimeout(delayDebounceFn);
}, [customerSearchInput, backendUrl, token]);

  // Product Inventory Search Pipeline
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const queryStr = frameInput.trim();
      if (queryStr.length > 0) {
        try {
          const res = await axios.get(
            `${backendUrl}/api/inventory/search-products?query=${queryStr}&category=${selectedProductCategory}`, 
            { headers: { token } }
          );

          if (res.data && Array.isArray(res.data.products)) {
            const parsedMatches = res.data.products.filter(p => p.category === selectedProductCategory);
            setFrameSuggestions(parsedMatches.slice(0, 8));
            setFrameActiveIndex(-1);
          } else {
            setFrameSuggestions([]);
          }
        } catch (err) { 
          console.error("Catalog search matching pipeline network fault:", err); 
          setFrameSuggestions([]);
        }
      } else {
        setFrameSuggestions([]);
      }
    }, 250); 
    return () => clearTimeout(delayDebounceFn);
  }, [frameInput, selectedProductCategory, backendUrl, token]);

  const handleLensTypeChange = (name) => {
    setLensType(name);
    const target = dbLensTypes.find(item => item.name === name);
    setBaseLensPrice(target ? Number(target.price || 0) : 0);
  };

  const handleFeatureToggle = (featureObj) => {
    const isSelected = selectedFeatures.some(f => f._id === featureObj._id);
    if (isSelected) {
      setSelectedFeatures(selectedFeatures.filter(f => f._id !== featureObj._id));
    } else {
      setSelectedFeatures([...selectedFeatures, featureObj]);
    }
  };

  const totalFeaturesPrice = selectedFeatures.reduce((sum, curr) => sum + Number(curr.price || 0), 0);
  const currentWorkspaceLensPrice = isLensConfigRequired ? (Number(baseLensPrice || 0) + Number(totalFeaturesPrice || 0)) : 0;

  const handleAddItemToGrid = (e) => {
    e.preventDefault();
    
    if (!frameId && (selectedProductCategory !== 'CONTACT_LENS' && selectedProductCategory !== 'POWERED_GLASS')) {
      toast.warn("Please pick a precise item out of the catalog search list down below before hitting commit.");
      return;
    }

    const parseEyeDataToStrings = (eyeObj) => ({
      sph: String(eyeObj.sph || '0.00'),
      cyl: String(eyeObj.cyl || '0.00'),
      axis: String(eyeObj.axis || '0'),
      add: String(eyeObj.add || '0.00'),
      pd: String(eyeObj.pd || '60')
    });

    const featureNamesText = selectedFeatures.length > 0 
      ? selectedFeatures.map(f => f.name).join(', ') 
      : 'None';

    const newGridItem = {
      gridId: Date.now() + Math.random().toString(36).substring(2, 7),
      category: selectedProductCategory,
      subCategory: selectedSubCategory,
      frameId: frameId || null,
      productName: selectedBrandAndName || `${selectedProductCategory.replace('_', ' ')} Custom Item`,
      framePrice: Number(framePrice || 0),
      lensType: isLensConfigRequired && lensType ? lensType : 'None',
      lensFeatures: isLensConfigRequired ? featureNamesText : 'None',
      lensPrice: Number(currentWorkspaceLensPrice || 0),
      itemSubtotal: Number(framePrice || 0) + Number(currentWorkspaceLensPrice || 0),
      rightEyePower: parseEyeDataToStrings(rightEye),
      leftEyePower: parseEyeDataToStrings(leftEye)
    };

    setItems([...items, newGridItem]);
    toast.success("Product successfully added into checkout invoice matrix!");

    setFrameInput('');
    setFrameId('');
    setFramePrice(0);
    setSelectedBrandAndName('');
  };

  const handleRemoveItemFromGrid = (gridId) => {
    setItems(items.filter(item => item.gridId !== gridId));
    toast.info("Product removed from ledger grid.");
  };

  const getGrossSubtotal = () => {
    return items.reduce((acc, curr) => acc + Number(curr.itemSubtotal || 0), 0);
  };

  const calculateTotalBill = () => {
    const gross = getGrossSubtotal();
    const calculatedDiscountAmount = (gross * Number(discount || 0)) / 100;
    return Math.max(0, Math.round(gross - calculatedDiscountAmount));
  };

  const selectCustomerItem = (cust) => {
    setPatientName(cust.patientName.toUpperCase()); 
    setMobileNum(cust.patientMobile.replace('+91', ''));
    setCustomerSearchInput(`${cust.patientName} (${cust.patientMobile})`);
    setPastHistory(cust.history || []);
    setIsReturningCustomer(true);
    setCustomerSuggestions([]);
    setIsCustomerSearchOpen(false);
  };

  const selectFrameItem = (prod) => {
    setFrameId(prod._id);
    setFramePrice(Number(prod.price || 0));
    setSelectedBrandAndName(`${prod.brand || 'Generic'} - ${prod.name}`.toUpperCase());
    setFrameInput(`${prod.brand || 'Generic'} - ${prod.name}`.toUpperCase());
    setFrameSuggestions([]); 
  };

  const handleCustomerKeyDown = (e) => {
    if (customerSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCustomerActiveIndex(p => {
        const n = p < customerSuggestions.length - 1 ? p + 1 : p;
        if (customerScrollRef.current && customerScrollRef.current.children[n]) {
          customerScrollRef.current.children[n].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return n;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCustomerActiveIndex(p => {
        const n = p > 0 ? p - 1 : 0;
        if (customerScrollRef.current && customerScrollRef.current.children[n]) {
          customerScrollRef.current.children[n].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return n;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (customerActiveIndex >= 0) selectCustomerItem(customerSuggestions[customerActiveIndex]);
    }
  };

  const handleFrameKeyDown = (e) => {
    if (frameSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFrameActiveIndex(p => {
        const n = p < frameSuggestions.length - 1 ? p + 1 : p;
        if (frameScrollRef.current && frameScrollRef.current.children[n + 1]) {
          frameScrollRef.current.children[n + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return n;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFrameActiveIndex(p => {
        const n = p > 0 ? p - 1 : 0;
        if (frameScrollRef.current && frameScrollRef.current.children[n + 1]) {
          frameScrollRef.current.children[n + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return n;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (frameActiveIndex >= 0) selectFrameItem(frameSuggestions[frameActiveIndex]);
    }
  };

  // NATIVE SINGLE-TRANSACTION MULTI-ITEM CHECKOUT SUBMITTER
  const handleFinalCheckoutSubmit = async () => {
    if (!patientName || !mobileNum) {
      toast.error("Please supply baseline Patient profile data fields.");
      return;
    }
    if (items.length === 0) {
      toast.error("Cart canvas ledger matrix is completely empty.");
      return;
    }

    try {
      const grossSubtotal = getGrossSubtotal();
      const computedDiscountCashValue = Math.round((grossSubtotal * Number(discount)) / 100);
      const computedTotalAmount = Math.max(0, Math.round(grossSubtotal - computedDiscountCashValue));

      // Build the single structured invoice payload containing the items child document array matrix
      const payload = {
        invoiceNumber: "INV-" + Date.now().toString().slice(-6),
        patientName: patientName.toUpperCase(),
        patientMobile: mobileNum,
        paymentMode: paymentMode,
        discount: computedDiscountCashValue,
        totalAmount: computedTotalAmount,
        
        // Map frontend rows neatly into your clean backend array field
        items: items.map(i => ({
          category: i.category,
          subCategory: i.subCategory,
          frameProduct: i.frameId || null,
          productName: i.productName,
          framePrice: Number(i.framePrice || 0),
          lensType: !i.lensType || i.lensType === 'None' ? 'Standard Non-Powered / Plano' : i.lensType,
          lensFeatures: !i.lensFeatures || i.lensFeatures === 'None' ? 'None' : i.lensFeatures,
          lensPrice: Number(i.lensPrice || 0),
          itemSubtotal: Number(i.itemSubtotal || 0),
          rightEyePower: i.rightEyePower,
          leftEyePower: i.leftEyePower
        }))
      };

      console.log("Submitting unified multi-item receipt payload directly over MongoDB:", payload);

      const res = await axios.post(`${backendUrl}/api/inventory/create-invoice`, payload, { headers: { token } });
      
      if (res.data.success) {
        toast.success(res.data.message || "Invoice processed successfully!");
        setItems([]);
        setCustomerSearchInput(''); 
        setMobileNum(''); 
        setPatientName(''); 
        setDiscount(0);
        setSelectedFeatures([]);
        setRightEye({ ...defaultEyePower });
        setLeftEye({ ...defaultEyePower });
      } else {
        toast.error(res.data.message || "Database execution error.");
      }
    } catch (err) {
      console.error("Payload collection transmission error log:", err);
      toast.error(err.response?.data?.message || "Invoice processing network disruption encountered.");
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans w-full">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 uppercase tracking-wider">
          🛒 Optical Store POS Counter & Dynamic Multi-Item Billing Desk
        </h1>

        {/* PROFILE IDENTIFICATION BANNER MODULE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative items-center">
          <div className="p-2 md:col-span-1 flex items-center justify-start relative">
            {!isCustomerSearchOpen ? (
              <button
                type="button"
                onClick={() => setIsCustomerSearchOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3.5 shadow-md flex items-center justify-center transition-all duration-200 active:scale-95"
              >
                <span className="text-base">🔍</span>
              </button>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-full relative transition-all duration-200">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-blue-900 uppercase">🔍 Patient Lookup Autocomplete</label>
                  <button 
                    type="button" 
                    onClick={() => { setIsCustomerSearchOpen(false); setCustomerSearchInput(''); setCustomerSuggestions([]); }}
                    className="text-gray-400 hover:text-gray-700 font-bold text-sm leading-none px-1"
                  >
                    ×
                  </button>
                </div>
                <input 
                  type="text" 
                  value={customerSearchInput} 
                  onChange={(e) => setCustomerSearchInput(e.target.value)} 
                  onKeyDown={handleCustomerKeyDown}
                  placeholder="Type name/mobile..." 
                  className="w-full bg-white border border-blue-300 rounded px-3 py-2 text-sm focus:border-blue-600 outline-none font-bold"
                  autoFocus
                />
                {customerSuggestions.length > 0 && (
                  <div ref={customerScrollRef} className="absolute left-4 right-4 mt-1 bg-white border border-blue-400 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {customerSuggestions.map((cust, idx) => (
                      <div key={cust._id} onClick={() => selectCustomerItem(cust)} className={`p-3 cursor-pointer flex justify-between items-center text-xs transition-all ${idx === customerActiveIndex ? 'bg-blue-600 text-white font-bold' : 'hover:bg-blue-50 text-slate-800'}`}>
                        <div>
                          <p className="text-sm">{cust.patientName}</p>
                          <p className="font-mono text-[11px] opacity-80">Record Phone: {cust.patientMobile}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-gray-300 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Patient Name</label>
              <input 
                type="text" 
                required 
                value={patientName} 
                onChange={(e)=>setPatientName(e.target.value.toUpperCase())} 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white font-bold uppercase tracking-wide focus:border-blue-500 outline-none"
                placeholder="ENTER FULL NAME"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Mobile Target Line</label>
              <input type="text" value={mobileNum} onChange={(e)=>setMobileNum(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white font-mono"/>
            </div>
          </div>
        </div>

        {/* WORKSPACE AREA: MANAGE AND COMPOSE SINGLE LINE ITEMS */}
        <div className="bg-slate-100/80 p-5 rounded-xl border border-gray-300 mb-8">
          <h3 className="text-sm font-black text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            ⚙️ Item Assembly & Configuration Workspace
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category Select</label>
                <select 
                  value={selectedProductCategory} 
                  onChange={(e) => setSelectedProductCategory(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-bold shadow-sm outline-none"
                >
                  {Object.keys(categoryMap).map(cat => (
                    <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sub-Category Variant</label>
                <select 
                  value={selectedSubCategory} 
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-bold shadow-sm outline-none"
                >
                  {(categoryMap[selectedProductCategory] || []).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* UNIFIED ROW ARCHITECTURE: SEARCH INPUT + COMMIT BUTTON */}
            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm space-y-3 relative z-20">
              <div>
                <label className="block text-xs font-black text-blue-950 uppercase mb-1">
                  🔍 Search Catalog Item Name or SKU
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={frameInput} 
                    onChange={(e) => setFrameInput(e.target.value.toUpperCase())} 
                    onKeyDown={handleFrameKeyDown}
                    placeholder="TYPE KEYWORDS (E.G. FASTRACK, RAY-BAN)..." 
                    className="flex-1 bg-slate-50 border border-gray-300 rounded px-3 py-2 text-sm outline-none font-bold uppercase focus:bg-white focus:border-blue-500 transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={handleAddItemToGrid}
                    className="sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-xs uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-1 shrink-0"
                  >
                    ➕ Commit Item
                  </button>
                </div>
                {frameId && (
                  <div className="flex justify-between items-center mt-1.5 px-1">
                    <p className="text-[10px] text-emerald-600 font-bold">✓ Connected: {frameId}</p>
                    <p className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Active Price: ₹{framePrice}</p>
                  </div>
                )}
              </div>

              {/* ATTACHED PRODUCT POPUP GRID PANEL */}
              {frameSuggestions.length > 0 && (
                <div ref={frameScrollRef} className="absolute left-0 right-0 top-full bg-white border border-blue-400 rounded-lg max-h-60 overflow-y-auto divide-y divide-gray-200 shadow-2xl z-50 p-1 mt-1">
                  <div className="sticky top-0 bg-blue-50 text-[10px] uppercase tracking-wider font-extrabold text-blue-800 p-2 flex justify-between items-center rounded-t border-b border-blue-200 z-10">
                    <span>Select matching product row:</span>
                    <span className="bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-mono text-[9px]">Live Catalog Matches</span>
                  </div>
                  {frameSuggestions.map((prod, idx) => (
                    <div 
                      key={prod._id} 
                      onClick={() => selectFrameItem(prod)} 
                      className={`p-3 my-0.5 cursor-pointer flex justify-between items-center text-xs rounded transition-colors ${idx === frameActiveIndex ? 'bg-blue-600 text-white font-bold' : 'hover:bg-blue-100 text-slate-800 bg-white'}`}
                    >
                      <div>
                        <p className="font-black text-sm text-slate-900">{(prod.brand || 'Generic').toUpperCase()} - {prod.name.toUpperCase()}</p>
                        <p className="font-mono text-[11px] text-slate-500 mt-0.5">SKU: {prod.sku || 'N/A'} | Style: {prod.subCategory || 'General'}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] block uppercase font-bold text-gray-400">Stock</span>
                          <span className={`inline-block px-2 py-0.5 font-mono font-bold rounded text-xs mt-0.5 ${Number(prod.stock || 0) <= 2 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
                            {prod.stock ?? 0} units
                          </span>
                        </div>
                        <p className="font-bold text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded font-mono">₹{prod.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SPLIT SCREEN ROW: SIDE-BY-SIDE VISION PARAMETERS & CORE GLASS DROPDOWN */}
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch ${isLensConfigRequired ? 'opacity-100' : 'opacity-30 pointer-events-none select-none'}`}>
              
              {/* LEFT SIDE: DIOPTER METRICS */}
              <div className="lg:col-span-7 bg-white p-3 border rounded-lg border-gray-300 shadow-sm">
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">👁️ Vision Metrics</p>
                <div className="space-y-2 text-[11px]">
                  {/* RIGHT EYE ROW */}
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded border border-gray-200">
                    <span className="font-black text-cyan-700 w-12 text-left shrink-0">R (OD)</span>
                    <div className="grid grid-cols-5 gap-1 w-full">
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">SPH</label>
                        <select value={rightEye.sph} onChange={(e)=>setRightEye({...rightEye, sph: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {sphCylRanges.map(v => <option key={`r-sph-${v}`} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">CYL</label>
                        <select value={rightEye.cyl} onChange={(e)=>setRightEye({...rightEye, cyl: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {sphCylRanges.map(v => <option key={`r-cyl-${v}`} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">Axis</label>
                        <select value={rightEye.axis} onChange={(e)=>setRightEye({...rightEye, axis: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {axisRanges.map(v => <option key={`r-ax-${v}`} value={v}>{v}°</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">ADD</label>
                        <select value={rightEye.add} onChange={(e)=>setRightEye({...rightEye, add: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {addRanges.map(v => <option key={`r-add-${v}`} value={v}>+{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">PD</label>
                        <select value={rightEye.pd} onChange={(e)=>setRightEye({...rightEye, pd: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {pdRanges.map(v => <option key={`r-pd-${v}`} value={v}>{v}mm</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* LEFT EYE ROW */}
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded border border-gray-200">
                    <span className="font-black text-purple-700 w-12 text-left shrink-0">L (OS)</span>
                    <div className="grid grid-cols-5 gap-1 w-full">
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">SPH</label>
                        <select value={leftEye.sph} onChange={(e)=>setLeftEye({...leftEye, sph: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {sphCylRanges.map(v => <option key={`l-sph-${v}`} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">CYL</label>
                        <select value={leftEye.cyl} onChange={(e)=>setLeftEye({...leftEye, cyl: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {sphCylRanges.map(v => <option key={`l-cyl-${v}`} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">Axis</label>
                        <select value={leftEye.axis} onChange={(e)=>setLeftEye({...leftEye, axis: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {axisRanges.map(v => <option key={`l-ax-${v}`} value={v}>{v}°</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">ADD</label>
                        <select value={leftEye.add} onChange={(e)=>setLeftEye({...leftEye, add: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {addRanges.map(v => <option key={`l-add-${v}`} value={v}>+{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-bold">PD</label>
                        <select value={leftEye.pd} onChange={(e)=>setLeftEye({...leftEye, pd: e.target.value})} disabled={!isPrescriptionRequired} className="w-full border rounded p-0.5 font-mono text-[11px]">
                          {pdRanges.map(v => <option key={`l-pd-${v}`} value={v}>{v}mm</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: CORE GLASS TYPE SELECTION */}
              <div className="lg:col-span-5 bg-white p-3 border rounded-lg border-gray-300 shadow-sm flex flex-col justify-center">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">🔬 Core Glass Type</label>
                <select 
                  value={lensType} 
                  onChange={(e) => handleLensTypeChange(e.target.value)} 
                  className="w-full bg-slate-50 border border-gray-300 rounded px-3 py-2.5 text-xs font-bold shadow-sm outline-none focus:bg-white focus:border-blue-500"
                >
                  {!lensType && <option value="">Select Lens...</option>}
                  {dbLensTypes.map(t => <option key={t._id} value={t.name}>{t.name} (₹{t.price})</option>)}
                </select>
                <p className="text-[10px] font-mono text-gray-400 mt-2 text-right">Base Price: ₹{baseLensPrice}</p>
              </div>

            </div>

            {/* DYNAMIC LOWER SECTION: MULTI-SELECT TREATMENT BADGES WORKSPACE */}
            <div className={`p-4 bg-white border border-gray-300 rounded-lg shadow-sm ${isLensConfigRequired ? 'block' : 'hidden'}`}>
              <div className="flex justify-between items-center mb-2.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">🛡️ Select Premium Features & Shields (Select Multiple)</label>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Features Subtotal: +₹{totalFeaturesPrice}
                </span>
              </div>
              
              {dbLensFeatures.length === 0 ? (
                <p className="text-xs font-medium text-gray-400 italic">No features available in catalog collections.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {dbLensFeatures.map((f) => {
                    const active = selectedFeatures.some(item => item._id === f._id);
                    return (
                      <button
                        key={f._id}
                        type="button"
                        onClick={() => handleFeatureToggle(f)}
                        className={`text-xs px-3 py-2 rounded-lg font-bold border transition-all flex items-center gap-1.5 shadow-sm outline-none select-none ${
                          active 
                            ? 'bg-blue-600 border-blue-700 text-white ring-2 ring-blue-300' 
                            : 'bg-slate-50 border-gray-200 text-gray-700 hover:bg-slate-100 hover:border-gray-300'
                        }`}
                      >
                        <span>{active ? '✓' : '＋'}</span>
                        <span>{f.name}</span>
                        <span className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded ml-1 ${active ? 'bg-blue-500 text-blue-50' : 'bg-gray-200 text-gray-600'}`}>
                          ₹{f.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* PRIMARY ITEM WORKSPACE BILLING GRID RECORD LAYOUT */}
        <div className="mb-8 border rounded-xl overflow-hidden shadow-sm border-gray-300">
          <div className="bg-slate-800 text-white p-3.5 text-xs font-black uppercase tracking-wider flex justify-between items-center">
            <span>📋 Live Itemized Invoice Row Aggregations</span>
            <span className="bg-blue-600 px-3 py-1 rounded font-mono text-[11px]">Total Count: {items.length}</span>
          </div>

          {items.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 text-gray-400 font-bold text-sm">
              No product items added to the grid canvas yet. Configure variants above.
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 border-b text-[11px] font-bold text-slate-700 uppercase">
                    <th className="p-3">Product Specifications</th>
                    <th className="p-3">Category Classification</th>
                    <th className="p-3 text-right">Frame Fee (₹)</th>
                    <th className="p-3 text-right">Lens/Coating Fee (₹)</th>
                    <th className="p-3 text-right">Subtotal (₹)</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs text-slate-800">
                  {items.map((item) => (
                    <tr key={item.gridId} className="hover:bg-slate-50 transition-colors">
                      {/* COLUMN 1: EXPANDED PRODUCT SPECIFICATIONS BOX */}
                      <td className="p-3 font-medium max-w-sm">
                        <div className="space-y-1">
                          <p className="text-slate-900 font-extrabold tracking-wide uppercase">{item.productName}</p>
                          {(item.category === 'EYE_GLASS' || item.category === 'POWERED_GLASS' || item.category === 'CONTACT_LENS') && (
                            <div className="bg-slate-50 p-2 rounded border border-gray-200 space-y-1 mt-1">
                              <p className="text-[11px] text-slate-600 font-medium">
                                <span className="text-blue-700 font-bold">Lens Type:</span> {item.lensType} 
                                <span className="mx-1 text-gray-300">|</span> 
                                <span className="text-purple-700 font-bold">Features:</span> {item.lensFeatures}
                              </p>
                              <div className="grid grid-cols-2 gap-2 pt-0.5 border-t border-dashed border-gray-200 text-[10px] font-mono font-bold">
                                <p className="text-cyan-700">OD (R): SPH {item.rightEyePower.sph} / CYL {item.rightEyePower.cyl}</p>
                                <p className="text-purple-700">OS (L): SPH {item.leftEyePower.sph} / CYL {item.leftEyePower.cyl}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      {/* COLUMN 2: CATEGORY CLASSIFICATION BADGE */}
                      <td className="p-3 align-middle">
                        <span className="inline-block bg-slate-100 text-slate-800 font-mono rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border border-gray-200 shadow-sm">
                          {item.category.replace('_', ' ')} <span className="text-gray-400 font-normal">({item.subCategory})</span>
                        </span>
                      </td>
                      {/* COLUMN 3: INDIVIDUAL PRICING LEDGER METRICS */}
                      <td className="p-3 text-right font-mono font-bold text-slate-600 align-middle">₹{item.framePrice}</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-600 align-middle">₹{item.lensPrice}</td>
                      <td className="p-3 text-right font-mono font-black text-slate-950 text-sm bg-slate-50/50 align-middle">₹{item.itemSubtotal}</td>
                      {/* COLUMN 4: ACTION TRIGGER BUTTON */}
                      <td className="p-3 text-center align-middle">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItemFromGrid(item.gridId)}
                          className="text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded px-2.5 py-1 transition-all text-[11px] font-bold shadow-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ACCOUNTING CONTROL ASSIGNMENT PANEL */}
        <div className="border-t pt-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Gross Cumulative Value (₹)</label>
            <input type="number" value={getGrossSubtotal()} readOnly className="w-full bg-gray-100 border rounded px-3 py-1.5 text-sm font-mono font-black text-slate-700" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Global Discount Rate</label>
            <div className="relative flex items-center w-full">
              <input 
                type="text" 
                inputMode="numeric"
                autoComplete="off"
                value={discount === 0 ? '' : discount} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d*$/.test(val)) {
                    const numValue = Number(val);
                    if (numValue <= 100) setDiscount(numValue);
                  }
                }} 
                placeholder="0"
                className="w-full border rounded pl-3 pr-8 py-1.5 text-sm font-mono font-bold text-rose-600 border-gray-300 focus:border-rose-500 bg-rose-50/30 outline-none" 
              />
              <span className="absolute right-3 text-sm font-bold text-rose-500 pointer-events-none">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Settlement Channel</label>
            <select value={paymentMode} onChange={(e)=>setPaymentMode(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-bold shadow-sm outline-none">
              <option value="Cash">💵 Cash Handover</option>
              <option value="UPI">📱 Digital UPI String</option>
              <option value="Card">💳 Credit-Debit Token Swipe</option>
            </select>
          </div>

          <div className="h-full flex items-end">
            <div className="bg-slate-100 border border-gray-300 p-2 rounded w-full flex justify-between items-center px-4">
              <span className="text-[10px] font-bold uppercase text-gray-500">Items Count:</span>
              <span className="font-mono text-sm font-black text-slate-800">{items.length}</span>
            </div>
          </div>
        </div>

        {/* POS MET NET INVOICING BANNER SUMMARY PANEL */}
        <div className="bg-slate-900 text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase block tracking-wider">Gross Settlement Due Balance</span>
            <span className="text-3xl font-extrabold font-mono text-emerald-400">₹{calculateTotalBill()}</span>
          </div>
          <button 
            type="button" 
            onClick={handleFinalCheckoutSubmit}
            disabled={items.length === 0}
            className={`w-full sm:w-auto text-slate-950 font-black px-12 py-3.5 rounded-lg uppercase tracking-widest text-xs shadow-md transition-transform active:scale-95 ${items.length === 0 ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            Print Multi-Item Ledger & Checkout 🧾
          </button>
        </div>

      </div>
    </div>
  );
};

export default StoreBilling;