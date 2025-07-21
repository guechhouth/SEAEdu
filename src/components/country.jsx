
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './navbar.jsx';

const Country = () => {
    const { code } = useParams(); // e.g. 'sg', 'ph', 'my'
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);


    const indicator = {
        literacy: "SE.ADT.LITR.ZS",
        genderParity: "SE.ENR.PRSC.FM.ZS",
        spending: "SE.XPD.TOTL.GD.ZS",
        yearSchool:"SE.SCH.LIFE",
        eduAttainment:"SE.TER.CUAT.UP.ZS"
    };

    useEffect(() => {
        async function fetchDetails() {
            
            try{
                setLoading(true);
                const fetchCountryData = async (code) => {
                    const response = await Promise.all([
                        fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator.literacy}?date=2019&format=json`),
                        fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator.genderParity}?date=2019&format=json`),
                        fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator.spending}?date=2019&format=json`),
                        fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator.yearSchool}?date=2019&format=json`),
                        fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator.eduAttainment}?date=2019&format=json`),
                    ]);
                    
                
                    const [litJson, parityJson, spendJson, yearJson, eduJson] = await Promise.all(response.map(res => res.json()));
                    return {
                        country: litJson[1]?.[0]?.country?.value || code,
                        literacyRate: litJson[1]?.[0]?.value ?? null,
                        genderParity: parityJson[1]?.[0]?.value ?? null,
                        spending: spendJson[1]?.[0]?.value ?? null,
                        yearSchool: yearJson[1]?.[0]?.value ?? null,
                        eduAttainment: eduJson[1]?.[0]?.value ?? null,
                    };
                };
                const results = await fetchCountryData(code.toUpperCase());
                setData(results);
            
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [code]);
    if (loading) return <p>Loading...</p>;

    if (!data) return <p>No data available for this country.</p>;

    return (
        <div className="about-container" style={{display: 'flex', flexDirection: 'row', height: '100vh'}}
        >
            <Navbar style={{  
            height: 'auto',
            width: '200px',
            backgroundColor: '#f2f2f2',
            display: 'flex',
            flexDirection: 'column',
            top: '0',
            textAlign: 'center'}}/>
        <div style={{paddingLeft: '2rem'}}>
            <h2 style={{textTransform:'uppercase'}}>{data.country}</h2>
            <ul>
                <li>Literacy Rate: {data.literacyRate !== null ? data.literacyRate.toFixed(2) + "%" : 'N/A'}</li>
                <li>Gender Parity: {data.genderParity !== null ? data.genderParity.toFixed(2) : 'N/A'}</li>
                <li>Spending on Education (% of GDP): {data.spending !== null ? data.spending.toFixed(2) + "%" : 'N/A'}</li>
                <li>Average Years of Schooling: {data.yearSchool !== null ? data.yearSchool.toFixed(2) : 'N/A'}</li>
                <li>Educational Attainment (% tertiary educated): {data.eduAttainment !== null ? data.eduAttainment.toFixed(2) + "%" : 'N/A'}</li>
            </ul>
        </div>
    </div>
    )
};
export default Country;