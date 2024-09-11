import { useState, useEffect } from 'react';
import './App.css';
import tinhTpData from './data/tinh_tp.json';
import quanHuyenData from './data/quan_huyen.json';
import propertiesData from './data/data.json';


function App() {
  const [selectedTinh, setSelectedTinh] = useState('');
  const [selectedQuan, setSelectedQuan] = useState('');
  const [filteredQuans, setFilteredQuans] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [areaRange, setAreaRange] = useState('');
  const [filteredProperties, setFilteredProperties] = useState(propertiesData);

  // Lọc các quận/huyện dựa trên tỉnh/thành phố được chọn
  useEffect(() => {
    if (selectedTinh) {
      const filtered = Object.values(quanHuyenData).filter(
        (quan) => quan.parent_code === selectedTinh
      );
      setFilteredQuans(filtered);
    } else {
      setFilteredQuans([]);
    }
  }, [selectedTinh]);

  // Hàm lọc dữ liệu bất động sản
  const filterProperties = () => {
    let filtered = propertiesData;

    // Lọc theo quận/huyện
    if (selectedQuan) {
      filtered = filtered.filter(property => property.district === selectedQuan);
    }

    // Lọc theo tỉnh/thành phố
    if (selectedTinh) {
      filtered = filtered.filter(property => property.city === selectedTinh);
    }

    // Lọc theo khoảng giá
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      filtered = filtered.filter(property => {
        if (maxPrice) {
          return property.price >= minPrice * 1000000 && property.price <= maxPrice * 1000000;
        } else {
          return property.price >= minPrice * 1000000;
        }
      });
    }
    // Lọc theo diện tích
    if (areaRange) {
      const [minArea, maxArea] = areaRange.split('-').map(Number);
      filtered = filtered.filter(property => {
        if (maxArea) {
          return property.area >= minArea && property.area <= maxArea;
        } else {
          return property.area >= minArea;
        }
      });
    }

    setFilteredProperties(filtered);
  };

  const handleFilter = () => {
    filterProperties();
  };

  const getAreaName = (cityCode, districtCode) => {
    const cityName = tinhTpData[cityCode]?.name_with_type || 'N/A';
    const districtName = quanHuyenData[districtCode]?.name_with_type || 'N/A';
    return `${districtName}, ${cityName}`;
  };

  return (
    <>
    {/* navbar */}
      <nav className="bg-orange-200 py-3 rounded-md">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4 items-end">
  
                  {/* Select Tỉnh/Thành */}
                  <div className="flex flex-col">
                    <h3 className="font-medium flex justify-start">Tỉnh/Thành</h3>
                    <select
                      className="rounded-sm px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-100"
                      value={selectedTinh}
                      onChange={(e) => setSelectedTinh(e.target.value)}
                    >
                      <option value="">Chọn Tỉnh/Thành</option>
                      {Object.entries(tinhTpData).map(([code, tinh]) => (
                        <option key={code} value={code}>
                          {tinh.name_with_type}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  {/* Select Quận/Huyện */}
                  <div className="flex flex-col">
                    <h3 className="font-medium flex justify-start">Quận/Huyện</h3>
                    <select
                      className="rounded-sm px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-100"
                      value={selectedQuan}
                      onChange={(e) => setSelectedQuan(e.target.value)}
                      disabled={!selectedTinh} // Chỉ cho phép chọn khi đã chọn Tỉnh/Thành
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {filteredQuans.map((quan) => (
                        <option key={quan.code} value={quan.code}>
                          {quan.name_with_type}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  {/* Select Khoảng Giá */}
                  <div className="flex flex-col">
                    <h3 className="font-medium flex justify-start">Khoảng Giá</h3>
                    <select
                      className="rounded-sm px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-100"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <option value="">Chọn Khoảng Giá</option>
                      <option value="0-1">0 - 1 triệu</option>
                      <option value="1-2">1 - 2 triệu</option>
                      <option value="2-3">2 - 3 triệu</option>
                      <option value="3-5">3 - 5 triệu</option>
                      <option value="5-7">5 - 7 triệu</option>
                      <option value="7-10">7 - 10 triệu</option>
                      <option value="10+">Trên 10 triệu</option>
                    </select>
                  </div>
  
                  {/* Select Diện Tích */}
                  <div className="flex flex-col">
                    <h3 className="font-medium flex justify-start">Diện Tích</h3>
                    <select
                      className="rounded-sm px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-100"
                      value={areaRange}
                      onChange={(e) => setAreaRange(e.target.value)}
                    >
                      <option value="">Chọn Diện Tích</option>
                      <option value="0-30">0 - 30 m²</option>
                      <option value="30-50">30 - 50 m²</option>
                      <option value="50-100">50 - 100 m²</option>
                      <option value="100+">Trên 100 m²</option>
                    </select>
                  </div>
  
                  {/* Button Lọc */}
                  <div className=''>
                    <button
                      className="rounded-sm bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-800"
                      onClick={handleFilter}
                    >
                      Lọc tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    
    {/* container */}
    <div className="container mx-auto py-4 px-40 ">
      {filteredProperties.map((property, index) => (
        <div key={index} className="flex align-center bg-orange-50 shadow-lg rounded-sm mb-6 p-3 ">
          {/* Hình ảnh */}
          <div className="w-40 ">
            <img src={property.thumbnail} alt={property.title} className="w-full h-full object-cover rounded-sm" />
          </div>
          
          {/* Nội dung */}
          <div className="w-full px-4">
            <div className='text-start'>
              <h3 className="text-base font-bold mb-2 text-red-500">{property.title}</h3>
              <p className="text-green-600 font-bold mb-2">{property.price.toLocaleString()} triệu/tháng</p>
              <p className="text-gray-500 mb-2">Diện tích:<span className='font-semibold pr-3'> {property.area} m²</span> Khu vực: <span className='font-semibold text-blue-600'>{getAreaName(property.city, property.district)}</span></p>
              <p className="text-gray-500">{property.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

export default App;
