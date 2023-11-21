document.addEventListener('DOMContentLoaded', async function () {
    const circles = document.querySelectorAll('.circle');
    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlay-content');
    const closeButton = document.getElementById('close-button');

    circles.forEach((circle) => {
        circle.addEventListener('click', async function () {
            const planetName = this.classList[1]; // Assumes the second class is the planet name
            const planetInfo = await getPlanetInfoFromAPI(planetName);
            console.log("KKKKKKKKK: ", planetInfo)
            showPlanetInfo(planetInfo);
        });
        circle.style.cursor = 'pointer';
    });

    async function getPlanetInfoFromAPI(planetName) {
        const baseUrl= `https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com`;

        try {
            console.log('API URL:', baseUrl);

            let keysResp = await fetch(`${baseUrl}/keys`, {
               method: "POST"
            });

            let keys = await keysResp.json();

            const response = await fetch(`${baseUrl}/bodies`, {
                method: 'GET',
                headers: { 'x-zocom': keys.key},
            });

            console.log('Response Status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data.bodies);
            console.log("planetName: ", planetName)

            return data.bodies.find(b => b.name.toLowerCase() === planetName);
        } catch (error) {
            console.error('Error getting planet information:', error.message);
            return { name: 'Unknown Planet', description: 'This planet is not available at the moment.' };
        }
        
    }
    function showPlanetInfo(planetInfo) {
        const name = planetInfo && planetInfo.name ? planetInfo.name : 'Unknown Planet';
        const latinName = planetInfo && planetInfo.latinName ? planetInfo.latinName : '';
        const rotation = planetInfo && planetInfo.rotation ? `Rotation: ${planetInfo.rotation} Earth days` : '';
        const circumference = planetInfo && planetInfo.circumference ? `Circumference: ${planetInfo.circumference} km` : '';
        const tempDay = planetInfo && planetInfo.temp && planetInfo.temp.day ? `Day Temperature: ${planetInfo.temp.day}°C` : '';
        const tempNight = planetInfo && planetInfo.temp && planetInfo.temp.night ? `Night Temperature: ${planetInfo.temp.night}°C` : '';
        const distance = planetInfo && planetInfo.distance ? `Distance from the Sun: ${planetInfo.distance} km` : '';
        const orbitalPeriod = planetInfo && planetInfo.orbitalPeriod ? `Orbital Period: ${planetInfo.orbitalPeriod} Earth days` : '';
        const description = planetInfo && planetInfo.desc ? planetInfo.desc : 'This planet is not available at the moment.';
        const moons = planetInfo && planetInfo.moons ? planetInfo.moons : [];
    
        const topSection = document.querySelector('.top-section');
        const middleLeft = document.querySelector('.middle-left');
        const middleRight = document.querySelector('.middle-right');
        const bottomSection = document.querySelector('.bottom-section');
    
        topSection.innerHTML = `
            <h1>${name}</h1>
            <p>${latinName}</p>
            <p>${description}</p>
            <hr>
        `;

        middleLeft.innerHTML = `
            <p>${rotation}</p>
            <p>${circumference}</p>
            <p>${tempDay}</p>
         
        `;
    
        middleRight.innerHTML = `
            
            <p>${distance}</p>
            <p>${orbitalPeriod}</p>
            <p>${tempNight}</p>
         
        `;
    
        bottomSection.innerHTML = `
        <hr>
        <p>Månar<p>
        <p>${moons}</p>
    `;
        overlay.style.display = 'flex';
    }
    

    closeButton.addEventListener('click', function () {
        closeOverlay();
    });

    function closeOverlay() {
        overlay.style.display = 'none';
    }
});
