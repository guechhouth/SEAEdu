import { useEffect,useState } from 'react'
import './App.css'


function App() {
  const [searchInput, setSearchInput] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");

  const countryCodes = ['KH', 'VN', 'TH', 'LA', 'MY', 'ID', 'PH', 'SG', 'BN', 'MM', 'TL'];

  const indicator = {
    literacy: "SE.ADT.LITR.ZS",
    genderParity: "SE.ENR.PRSC.FM.ZS",
    spending: "SE.XPD.TOTL.GD.ZS"
  };


  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
      
        const fetchCountryData = async (code) => {
          const response = await Promise.all([
            fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator.literacy}?date=2019&format=json`),
            fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator.genderParity}?date=2019&format=json`),
            fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator.spending}?date=2019&format=json`),
          ]);

          const [litJson, parityJson, spendJson] = await Promise.all(response.map(res => res.json()));

          return {
            country: litJson[1]?.[0]?.country?.value || code,
            literacyRate: litJson[1]?.[0]?.value ?? null,
            genderParity: parityJson[1]?.[0]?.value ?? null,
            spending: spendJson[1]?.[0]?.value ?? null,
          };
        };
        const results = await Promise.all(countryCodes.map(fetchCountryData));
        setAllData(results);
        setFilteredData(results);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const results = allData;
  const rateLength = results.filter(item => item.literacyRate !== null).length;
  const parityLength = results.filter(item => item.genderParity !== null).length;
  const spendingLength = results.filter(item => item.spending !== null).length;

  const rate = (results.reduce((sum, item)=> sum + (item.literacyRate || 0),0)/rateLength).toFixed(2)+ "%";
  const parity = (results.reduce((sum, item)=> sum + (item.genderParity || 0),0)/parityLength).toFixed(2);
  const spending = (results.reduce((sum, item)=> sum + (item.spending || 0),0)/spendingLength).toFixed(2)+ "%";
  const topCountry = "Singapore";

  const handleSearch = () => {
    const query = searchInput.trim().toLowerCase();

    setSelectedFilter("");

    if (query === "") {
      setFilteredData(allData);
      return;
    }

    const results = allData.filter(item => 
      item.country.toLowerCase().includes(query)
    );
    setFilteredData(results);
  }

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);

    let filtered = allData;

    setSearchInput("");

    if (value === "lowLiteracy") {
      filtered = allData.filter(item => item.literacyRate < 90);
    } 
    if (value === "highGPI") {
      filtered = allData.filter(item => item.genderParity > 1.00);
    } 
    if (value === "lowSpending") {
      filtered = allData.filter(item => item.spending < 2.50);
    }

    setFilteredData(filtered);
  };

  return (
    <div>
      <h1>Educational Access in Southeast Asia</h1>
      <h3>Based on 2019's Data</h3>
      <div className="summary">
        <div className = "average">
          <h3>Average Literacy Rate</h3>
          <h3>{rate}</h3>
        </div>
        <div className="parity">
          <h3>Gender Parity</h3>
          <h3>{parity}</h3>
        </div>
        <div className="spending">
          <h3>Education Spending (% of GDP)</h3>
          <h3>{spending}</h3>
        </div>
        <div className="top">
          <h3>Top Performer</h3>
          <h3>{topCountry}</h3>
        </div>
      </div>

      <div className="search">
        <input 
          id ="searchbar" 
          type="text" 
          value={searchInput}
          placeholder="Search by Country"
          onChange={(e) => setSearchInput(e.target.value)}/>
        <button onClick={handleSearch}>Search</button>
        <select value={selectedFilter} onChange={handleFilterChange}>
          <option value="">-- Select Filter --</option>
          <option value="lowLiteracy">Literacy &lt; 90%</option>
          <option value="highGPI">Gender Parity &gt; 1</option>
          <option value="lowSpending">Spending &lt; 2.5% GDP</option>
        </select>
      </div>

      <div className="chart">
        <div className="header">
          <h3>Country</h3>
          <h3>Literacy Rate (%)</h3>
          <h3>Gender Parity</h3>
          <h3>Spending</h3>
        </div>
        {filteredData.map((item,index) =>(
            <div key="index" className ="row">
              <p>{item.country}</p>
              <p>{item.literacyRate ? item.literacyRate.toFixed(2) : "N/A"}</p>
              <p>{item.genderParity ? item.genderParity.toFixed(2) : "N/A"}</p>
              <p>{item.spending ? item.spending.toFixed(2) : "N/A"}</p>
            </div>
        ))}
        {filteredData.length === 0 && !loading && (
            <p>No results found.</p>)}
      </div>
    </div>
  )
}

export default App
