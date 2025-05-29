document.addEventListener('DOMContentLoaded', () => {
  fetch('https://randomuser.me/api/?results=10&nat=us,es')
    .then(res => res.json())
    .then(data => {
      const personas = data.results;
      const container = document.getElementById('personas-container');

      personas.forEach(persona => {
        const card = document.createElement('div');
        card.className = 'person-card';

        card.innerHTML = `
          <img src="${persona.picture.large}" alt="${persona.name.first}">
          <h2>${persona.name.first} ${persona.name.last}</h2>
          <p><strong>Género:</strong> ${persona.gender === 'male' ? 'Masculino' : 'Femenino'}</p>
          <p><strong>Ubicación:</strong> ${persona.location.city}, ${persona.location.country}</p>
          <p><strong>Correo:</strong> ${persona.email}</p>
          <p><strong>Fecha de nacimiento:</strong> ${new Date(persona.dob.date).toLocaleDateString()}</p>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error al cargar datos:', err);
    });
});
