// script.js for Web3 RPG Fundraiser

// 1. Solana Phantom Wallet Integration
async function connectWallet() {
    const { solana } = window;
    if (solana && solana.isPhantom) {
        try {
            const response = await solana.connect();
            console.log('Connected with Public Key:', response.publicKey.toString());
        } catch (err) {
            console.error('Connection error:', err);
        }
    } else {
        alert('Phantom wallet not found. Please install it.');
    }
}

// 2. 3-Step Modal System for Pledge Flow
function openModal(step) {
    const modal = document.getElementById('pledgeModal');
    modal.style.display = 'block';
    showStep(step);
}

function showStep(step) {
    const steps = document.querySelectorAll('.modal-step');
    steps.forEach((s, index) => {
        s.style.display = index === step ? 'block' : 'none';
    });
}

function nextStep(currentStep) {
    showStep(currentStep + 1);
}

function submitPledge() {
    // Capture pledge amount and contact info
    const amount = document.getElementById('pledgeAmount').value;
    const contact = document.getElementById('contactInfo').value;
    localStorage.setItem('pledgeData', JSON.stringify({ amount, contact }));
    // Submit to backend API
    fetch('https://backend.api/pledge', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ amount, contact })
    });
    alert('Pledge submitted!');
}

// 3. Champion and Monster Data Rendering
const champions = [{name: 'Champion 1'}, {name: 'Champion 2'}, {name: 'Champion 3'}, {name: 'Champion 4'}, {name: 'Champion 5'}, {name: 'Champion 6'}, {name: 'Champion 7'}, {name: 'Champion 8'}, {name: 'Champion 9'}, {name: 'Champion 10'}];
const monsters = [{name: 'Monster 1'}, {name: 'Monster 2'}, {name: 'Monster 3'}, {name: 'Monster 4'}, {name: 'Monster 5'}, {name: 'Monster 6'}, {name: 'Monster 7'}, {name: 'Monster 8'}, {name: 'Monster 9'}, {name: 'Monster 10'}];

function renderChampions() {
    const container = document.getElementById('championContainer');
    champions.forEach(champion => {
        const div = document.createElement('div');
        div.innerText = champion.name;
        container.appendChild(div);
    });
}

function renderMonsters() {
    const container = document.getElementById('monsterContainer');
    monsters.forEach(monster => {
        const div = document.createElement('div');
        div.innerText = monster.name;
        container.appendChild(div);
    });
}

// 4. Skill Tree Canvas Rendering
const canvas = document.getElementById('skillTreeCanvas');
const ctx = canvas.getContext('2d');
function drawSkillTree() {
    // Drawing logic here
}

// 5. Castle Floor Visualization
function visualizeCastle() {
    // Visualization logic here
}

// 6. Form Submission and Local Storage
function handleFormSubmit(event) {
    event.preventDefault();
    submitPledge();
}

document.getElementById('pledgeForm').addEventListener('submit', handleFormSubmit);

// 7. Intersection Observer for Scroll Animations
const sections = document.querySelectorAll('.scroll-section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
});
sections.forEach(section => observer.observe(section));

// Initialize
window.addEventListener('load', () => {
    renderChampions();
    renderMonsters();
    drawSkillTree();
    visualizeCastle();
});

connectWallet();