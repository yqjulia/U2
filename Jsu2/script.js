document.addEventListener('DOMContentLoaded', async function () {
    const apiKey = 'solaris-1Cqgm3S6nlMechWO';
    const circles = document.querySelectorAll('.circle');
    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlay-content');
    const closeButton = document.getElementById('close-button');

    circles.forEach((circle) => {
        circle.addEventListener('click', async function () {
            const planetName = this.classList[1]; // Assumes the second class is the planet name
            const planetInfo = await getPlanetInfoFromAPI(planetName);
            showPlanetInfo(planetInfo);
        });
        circle.style.cursor = 'pointer';
    });

    async function getPlanetInfoFromAPI(planetName) {
        const apiUrl = `https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies/${planetName}`;

        try {
            console.log('API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'x-zocom': apiKey },
            });

            console.log('Response Status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            return data;
        } catch (error) {
            console.error('Error getting planet information:', error.message);
            return { name: 'Unknown Planet', description: 'This planet is not available at the moment.' };
        }
    }

    function showPlanetInfo(planetInfo) {
        const name = planetInfo && planetInfo.name ? planetInfo.name : 'Unknown Planet';
        const description = planetInfo && planetInfo.description ? planetInfo.description : 'This planet is not available at the moment.';

        overlayContent.innerHTML = `
            <h1>${name}</h1>
            <p>${description}</p>
            <!-- Add more planet information as needed -->
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
