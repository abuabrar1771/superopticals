import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PrescriptionForm = () => {
  // 1. Initialize state with empty strings so they don't show error immediately 
  // unless you specifically want to flag empty fields.
  const [prescription, setPrescription] = useState({
    od_sph: "", od_cyl: "", od_axis: "",
    os_sph: "", os_cyl: "", os_axis: ""
  });

  const handleChange = (key, value) => {
    setPrescription(prev => ({ ...prev, [key]: value }));
  };

  // Option Generators
  const generateOptions = (min, max, step, isFloat = true) => {
    const options = [];
    for (let i = min; i <= max; i += step) {
      options.push(i > 0 && isFloat ? `+${i.toFixed(2)}` : isFloat ? i.toFixed(2) : i.toString());
    }
    return options;
  };

  const sphOptions = generateOptions(-20.00, 12.00, 0.25);
  const cylOptions = generateOptions(-6.00, 6.00, 0.25);
  const axisOptions = generateOptions(0, 180, 1, false);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white">
      <h2 className="text-center font-bold text-lg mb-6 text-gray-800">Enter Prescription Details</h2>

      {/* Header */}
      <div className="grid grid-cols-[100px_1fr_1fr_1fr] text-center mb-1">
        <div />
        <div className="text-sm font-semibold text-gray-600">SPH</div>
        <div className="text-sm font-semibold text-gray-600">CYL</div>
        <div className="text-sm font-semibold text-gray-600">Axis</div>
      </div>

      {/* OD Row (Right Eye) */}
      <div className="grid grid-cols-[100px_1fr_1fr_1fr] border border-gray-200 rounded-t-md">
        <div className="flex flex-col justify-center items-center bg-gray-50 border-r py-3">
          <span className="font-bold text-xl">OD</span>
          <span className="text-[10px] text-gray-400 uppercase">Right Eye</span>
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

      {/* OS Row (Left Eye) - FIXED LABELS HERE */}
      <div className="grid grid-cols-[100px_1fr_1fr_1fr] border-x border-b border-gray-200 rounded-b-md">
        <div className="flex flex-col justify-center items-center bg-gray-50 border-r py-3">
          <span className="font-bold text-xl text-gray-600">OS</span>
          <span className="text-[10px] text-gray-400 uppercase">Left Eye</span>
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
  // Logic: Only show red if the user has typed something that isn't in our list 
  // OR if you want to keep it simple, remove the red ring entirely until submit.
  const isValid = value === "" || options.includes(value);

  return (
    <div className={`relative group flex items-center bg-white transition-all
      ${borderRight ? 'border-r border-gray-200' : ''}
      ${!isValid ? 'ring-1 ring-red-500 bg-red-50' : 'hover:bg-gray-50'}`}>
      
      <input 
        list={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select/Type"
        className="w-full h-full py-4 px-3 bg-transparent text-sm text-gray-700 outline-none z-10"
      />

      <datalist id={id}>
        {options.map(opt => <option key={opt} value={opt} />)}
      </datalist>
      
      <div className="absolute right-3 pointer-events-none">
        <ChevronDown size={14} className="text-gray-400" />
      </div>
    </div>
  );
};

export default PrescriptionForm;