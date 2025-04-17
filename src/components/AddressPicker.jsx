import React, { useEffect, useState } from "react";

const AddressPicker = ({ onChange, resetTrigger }) => {
  const [data, setData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    fetch("/vietnam_location.json")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  // 👇 Reset tỉnh, huyện, xã mỗi khi resetTrigger thay đổi
  useEffect(() => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
  }, [resetTrigger]);

  const handleProvinceChange = (e) => {
    const value = e.target.value;
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    onChange({ province: value, district: "", ward: "" });
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectedDistrict(value);
    setSelectedWard("");
    onChange({ province: selectedProvince, district: value, ward: "" });
  };

  const handleWardChange = (e) => {
    const value = e.target.value;
    setSelectedWard(value);
    onChange({ province: selectedProvince, district: selectedDistrict, ward: value });
  };

  const selectedProvinceObj = data.find((p) => p.name === selectedProvince);
  const selectedDistrictObj = selectedProvinceObj?.districts.find((d) => d.name === selectedDistrict);

  return (
    <div className="address-picker">
      <select value={selectedProvince} onChange={handleProvinceChange}>
        <option value="">Chọn Tỉnh / Thành phố</option>
        {data.map((province) => (
          <option key={province.code} value={province.name}>
            {province.name}
          </option>
        ))}
      </select>

      <select
        value={selectedDistrict}
        onChange={handleDistrictChange}
        disabled={!selectedProvince}
      >
        <option value="">Chọn Quận / Huyện</option>
        {selectedProvinceObj?.districts.map((district) => (
          <option key={district.code} value={district.name}>
            {district.name}
          </option>
        ))}
      </select>

      <select
        value={selectedWard}
        onChange={handleWardChange}
        disabled={!selectedDistrict}
      >
        <option value="">Chọn Phường / Xã</option>
        {selectedDistrictObj?.wards.map((ward) => (
          <option key={ward.code} value={ward.name}>
            {ward.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AddressPicker;
