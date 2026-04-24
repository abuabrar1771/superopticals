import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// ✅ Pass the prop here!
const PrescriptionForm = ({ onUpdatePrescription }) => {
  const [prescription, setPrescription] = useState({
    od_sph: "", od_cyl: "", od_axis: "",
    os_sph: "", os_cyl: "", os_axis: ""
  });

  // Updated handleChange to sync with Product.jsx
  const handleChange = (key, value) => {
    const updatedData = { ...prescription, [key]: value };
    setPrescription(updatedData);
    
    // ✅ This sends the data to Product.jsx instantly
    if (onUpdatePrescription) {
      onUpdatePrescription(updatedData);
    }
  };

  // Option Generators
  const generateOptions = (min, max, step, isFloat = true) => {
    const options = [];
    for (let i = min; i <= max; i += step) {
      const val = i > 0 && isFloat ? `+${i.toFixed(2)}` : isFloat ? i.toFixed(2) : i.toString();
      options.push(val);
    }
    return options;
  };

  const sphOptions = generateOptions(-20.00, 12.00, 0.25);
  const cylOptions = generateOptions(-6.00, 6.00, 0.25);
  const axisOptions = generateOptions(0, 180, 1, false);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-center font-bold text-lg mb-6 text-gray-800 uppercase tracking-tight">
        Enter Prescription Details
      </h2>

      {/* Header */}
      <div className="grid grid-cols-[100px_1fr_1fr_1fr] text-center mb-1">
        <div />
        <div className="text-xs font-bold text-gray-400 uppercase">SPH</div>
        <div className="text-xs font-bold text-gray-400 uppercase">CYL</div>
        <div className="text-xs font-bold text-gray-400 uppercase">Axis</div>
      </div>

      {/* OD Row (Right Eye) */}
      <div className="grid grid-cols-[100px_1fr_1fr_1fr] border border-gray-200 rounded-t-xl overflow-hidden">
        <div className="flex flex-col justify-center items-center bg-gray-50 border-r py-3">
          <span className="font-bold text-xl text-gray-800">OD</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">Right Eye</span>
        </div>
        
        <PrescriptionCell 
          id="od-sph" options={sphOptions} value={prescription.od_sph} 
          onChange={(val) => handleChange('od_sph', val)} borderRight 
        />
        <PrescriptionCell 
          id="od-cyl" options={cylOptions} value={prescription.od_cyl} 
          onChange={(val) => handleChange('od_cyl', val)} borderRight 
        />
        <PrescriptionCell 
          id="od-axis" options={axisOptions} value={prescription.od_axis} 
          onChange={(val) => handleChange('od_axis', val)} 
        />
      </div>

      {/* OS Row (Left Eye) */}
      <div className="grid grid-cols-[100px_1fr_1fr_1fr] border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
        <div className="flex flex-col justify-center items-center bg-gray-50 border-r py-3">
          <span className="font-bold text-xl text-gray-800">OS</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">Left Eye</span>
        </div>
        
        <PrescriptionCell 
          id="os-sph" options={sphOptions} value={prescription.os_sph} 
          onChange={(val) => handleChange('os_sph', val)} borderRight 
        />
        <PrescriptionCell 
          id="os-cyl" options={cylOptions} value={prescription.os_cyl} 
          onChange={(val) => handleChange('os_cyl', val)} borderRight 
        />
        <PrescriptionCell 
          id="os-axis" options={axisOptions} value={prescription.os_axis} 
          onChange={(val) => handleChange('os_axis', val)} 
        />
      </div>
    </div>
  );
};

const PrescriptionCell = ({ id, options, value, onChange, borderRight }) => {
  return (
    <div className={`relative group flex items-center bg-white transition-all
      ${borderRight ? 'border-r border-gray-200' : ''}
      hover:bg-gray-50`}>
      
      <input 
        list={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full h-full py-5 px-3 bg-transparent text-sm font-medium text-gray-700 outline-none z-10 text-center"
      />

      <datalist id={id}>
        {options.map(opt => <option key={opt} value={opt} />)}
      </datalist>
      
      <div className="absolute right-2 pointer-events-none opacity-30">
        <ChevronDown size={12} />
      </div>
    </div>
  );
};

export default PrescriptionForm;