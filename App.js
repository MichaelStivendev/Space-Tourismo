const openMenu = document.querySelector(".icon-menu");
const menu = document.querySelector(".menu-link");
const closeMenu = document.querySelector(".close-menu");
const mainContent = document.querySelector(".main-content");
const navLink = document.querySelectorAll(".nav-link");



let records = [];

async function fetchDate() {
  try {
    const response = await fetch("data.json");
    const jsonData = await response.json();
    records = jsonData;
  } catch (error) {
    console.error(error);
  }
}

if (openMenu) openMenu.addEventListener("click", toggleMenu);
if (closeMenu) closeMenu.addEventListener("click", toggleMenu);

function setInitialActiveLink(navLink, curretPage) {
  navLink.forEach((link) => {
    if (link.getAttribute("href") === curretPage) {
      updateActiveLink(link.parentElement);
    }
  });
}

function setupNavigationEvents(navLink) {
  navLink.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const url = event.target.getAttribute("href");
      const li = event.target.parentElement;
      history.pushState({ url }, "", `?page=${url}`);
      loadContent(url);
      updateActiveLink(li);
      toggleMenu();
    });
  });
}

function updateActiveLink(targetLink) {
  const currentActive = document.querySelector(".li_active");
  if (currentActive) {
    currentActive.classList.remove("li_active");
  }
  targetLink.classList.add("li_active");
}

function initNavigation(navLink, curretPage) {
  setInitialActiveLink(navLink, curretPage);
  setupNavigationEvents(navLink);
}

function toggleMenu() {
  menu.classList.toggle("menu-open");
}

const pageHandlers = {
  "home.html": () => {
    const bodyElement = document.body;
    bodyElement.className = "";
    const explore = document.querySelector(".explore");
    
    explore.addEventListener("click",()=>{
      let url = "destination.html";
      history.pushState({ url }, "", `?page=destination.html`);
      loadContent(url);

      const newActiveLink = document.querySelector(`a[href="${url}"]`);
       if (newActiveLink) {
        updateActiveLink(newActiveLink.parentElement); 
      }
    })
    
  },
  "creaw.html": () => {
    resetBackground("crew");
    renderCrewPage();
  },
  "technology.html": () => {
    resetBackground("technology");
    renderTechno();
  },
  "destination.html": () => {
    resetBackground("destination");
    renderDestinations();
  },
};
function resetBackground(page) {
  const bodyElement = document.body;
  (bodyElement.className = ""), bodyElement.classList.add(`bg-${page}`);
}

function getCurrentPage() {
  const params = new URLSearchParams(window.location.search);
  return params.get("page");
}
function handlePageChange() {
  const page = getCurrentPage();
  initNavigation(navLink, page);
  if (page) {
    loadContent(page);
  } else {
    loadContent("home.html");
  }
}

window.addEventListener("popstate", () => {
  handlePageChange();
});

async function loadContent(url) {
  const html = await fetchPage(url);

  htmlParser(html);
  if (pageHandlers[url]) {
    pageHandlers[url]();
  }
}

function htmlParser(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const mainContent = document.querySelector(".main-content");
  const newContent = doc.querySelector(".main-content").innerHTML;

  mainContent.innerHTML = newContent;
}

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return `<div class="main-content">
  <h1>Error</h1>
  <p>No se pudo cargar la página</p>
</div>`;
    }
    const html = await response.text();
    return html;
  } catch (error) {
    return console.log(error);
  }
}

function renderDestinations() {
  const renderDest = document.querySelector("#container-destination");
  const datos = records.destinations;
  renderDest.innerHTML = "";
  let name = [];

  for (let i = 0; i < datos.length; i++) {
    const element = datos[i].name;
    name.push(element);
  }

  const dato = datos.find((el) => el.name === datos[0].name);

  const btndiv = renderBtn(name);
  const renderPlanet = renderDestinationDetails(dato);
  const content = renderPlanet.querySelector("#contentRight");
  const h2 = content.querySelector("h2");
 
  content.insertBefore(btndiv, h2);
  renderDest.append(renderPlanet);
}

function rederizarPlanetaNuevo(newPlanet) {
  const dato = records.destinations.find((el) => el.name === newPlanet);
  const elementsToAnimate = document.querySelectorAll(
    "#planet-image, #destination-name, #destination-description, .info-group"
  );

  elementsToAnimate.forEach((el) => el.classList.remove("fade-in"));

  setTimeout(() => {
    document.querySelector("#planet-image").src = dato.images.webp;
    document.querySelector("#destination-name").textContent = dato.name;
    document.querySelector("#distance-value").textContent = dato.distance;
    document.querySelector("#travel-value").textContent = dato.travel;
    document.querySelector("#destination-description").textContent =
      dato.description;

    elementsToAnimate.forEach((el) => el.classList.add("fade-in"));
  }, 30);
}

function renderBtn(name) {
  const btndiv = document.createElement("div");
  btndiv.classList.add("div-btn");

  name.forEach((item) => {
    const btn = document.createElement("button");
    btn.textContent = item;
    if (item === name[0]) {
      btn.className = "planetActive";
    }

    btn.addEventListener("click", (e) => {
      const btnActive = document.querySelector(".planetActive");
      btnActive.classList.remove("planetActive");
      e.className = "";
      e.target.classList.add("planetActive");
      rederizarPlanetaNuevo(e.target.textContent);
    });
    btndiv.append(btn);
  });
  return btndiv;
}

function renderDestinationDetails(dato) {
  const info = document.createElement("div");
  info.className = "info-container";
  const img = document.createElement("img");
  img.src = dato.images.webp;
  img.setAttribute("width", "100%");
  img.id = "planet-image";

  const h2 = document.createElement("h2");
  h2.textContent = dato.name;
  h2.id = "destination-name";
  const p = document.createElement("p");
  p.textContent = dato.description;
  p.id = "destination-description";

  const infoTravel = document.createElement("div");
  const infoDistance = document.createElement("div");
  const infoTime = document.createElement("div");
  const contentIfo = document.createElement("div");
  contentIfo.id = "contentRight";
  infoTravel.id = "infoDestination";
  const dist = document.createElement("p");
  dist.textContent = "AVG. DISTANCE";

  const distance = document.createElement("p");
  distance.textContent = dato.distance;
  distance.id = "distance-value";

  const trave = document.createElement("p");
  trave.textContent = "EST. TRAVEL TIME";

  const travel = document.createElement("p");
  travel.textContent = dato.travel;
  travel.id = "travel-value";


  infoDistance.append(dist,distance);
  infoTime.append(trave,travel);

  infoTravel.append(infoDistance,infoTime);

  contentIfo.append(h2,p,infoTravel);

  info.append(img, contentIfo);

  return info;
}

function renderCrewPage() {
  const renderCrew = document.querySelector("#container-crew");

  const crew = records.crew;

  const crewRender = records.crew[0];

  const datosDdevueltos = renderCrewPageInfo(crewRender);
  const botonesCrew = renderBtnCrew(crew.length);
  const elementRender = datosDdevueltos.querySelector("#infoText");

  elementRender.append(botonesCrew);
  renderCrew.append(datosDdevueltos);
}

function renderBtnCrew(elements) {
  let currentActive = 0;
  let botones = [];

  const containerBtn = document.createElement("div");
  containerBtn.className = "container-btnCrew";
  for (let i = 0; i < elements; i++) {
    const div = document.createElement("div");
    div.id = i.toString();
    div.className = "btnCrew";

    if (i === currentActive) {
      div.classList.add("crewActive");
    }

    div.addEventListener("click", (el) => {
      const activebtn = document.querySelector(".crewActive");
      activebtn.classList.remove("crewActive");
      el.target.classList.add("crewActive");
      updateCrew(i);
    });
    botones.push(div);
  }
  containerBtn.append(...botones);

  return containerBtn;
}

function updateCrew(element) {
  const crewRender = records.crew[element];
  const elementsToAnimate = document.querySelectorAll(
    "#crew-image, #crew-role, #crew-name, #crew-bio"
  );
  elementsToAnimate.forEach((el) => el.classList.remove("fade-in"));

  setTimeout(() => {
    document.querySelector("#crew-image").src = crewRender.images.webp;
    document.querySelector("#crew-role").textContent = crewRender.role;
    document.querySelector("#crew-name").textContent = crewRender.name;
    document.querySelector("#crew-bio").textContent = crewRender.bio;

    elementsToAnimate.forEach((el) => el.classList.add("fade-in"));
  }, 30);
}

function renderCrewPageInfo(dato) {
  const info = document.createElement("div");
  info.id= "infoCrew";
  const infoText = document.createElement("div");
  infoText.id ="infoText";
  const img = document.createElement("img");
  img.src = dato.images.webp;
  img.setAttribute("width", "100%");
  img.id = "crew-image";

  const h3 = document.createElement("h3");
  h3.textContent = dato.role;
  h3.id = "crew-role";

  const h2 = document.createElement("h2");
  h2.textContent = dato.name;
  h2.id = "crew-name";
  const p = document.createElement("p");
  p.textContent = dato.bio;
  p.id = "crew-bio";

  infoText.append(h3,h2,p);

  info.append(infoText, img);

  return info;
}

function renderTechno() {
  const renderDest = document.querySelector("#container-techno");
  const techRender = records.technology[0];
  const info = renderTechnologyInfo(techRender);

  const botonesTechno = renderBtnTechno(records.technology.length);
  const elementRender = info.querySelector("#divContainer");
   const textoTechno = elementRender.querySelector("#textelement");
   
  elementRender.insertBefore(botonesTechno, textoTechno);

  renderDest.append(info);
}

function renderBtnTechno(number) {
  let botones = [];

  const containerTechno = document.createElement("div");
  containerTechno.className = "containerBtnTechno";
  for (let i = 0; i < number; i++) {
    const div = document.createElement("div");
    div.id = i;
    div.className = "btnTechno";
    div.textContent = i + 1;
    if (i === 0) {
      div.classList.add("technoActive");
    }
    div.addEventListener("click", (el) => {
      const activeElement = document.querySelector(".technoActive");
      activeElement.classList.remove("technoActive");
      el.target.classList.add("technoActive");
      updateTechno(i);
    });

    botones.push(div);
  }
  
  containerTechno.append(...botones);

  return containerTechno;
}
function updateTechno(element) {
  const technoRender = records.technology[element];
  const elementsToAnimate = document.querySelectorAll(
    "#img-techno, #h2-techno, #texto-techno"
  );
  elementsToAnimate.forEach((el) => el.classList.remove("fade-in"));

  setTimeout(() => {
    document.querySelector("#img-techno").src = technoRender.images.portrait;
    document.querySelector("#h2-techno").textContent = technoRender.name;
    document.querySelector("#texto-techno").textContent =
      technoRender.description;

    elementsToAnimate.forEach((el) => el.classList.add("fade-in"));
  }, 30);
}

function renderTechnologyInfo(dato) {
  const div = document.createElement("div");
  div.id = "container";
  const img = document.createElement("img");
  img.src = dato.images.portrait;
  img.id = "img-techno";

  const h2 = document.createElement("h2");
  h2.textContent = dato.name;
  h2.id = "h2-techno";

  const p = document.createElement("p");
  p.textContent = dato.description;
  p.id = "texto-techno";
  const texto = document.createElement("h2");
  texto.textContent = "THE TERMINOLOGY...";
  texto.id ="textoTechno";
  const divInfo = document.createElement("div");
  divInfo.id = "textelement";
  divInfo.append(texto,h2,p);
  const divContainer = document.createElement("div");
  divContainer.id = "divContainer";
  divContainer.append(divInfo);
  div.append(img, divContainer);
  return div;
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchDate();
  handlePageChange();
});

window.addEventListener("click",(e)=>{
  
   
  if (!e.target.closest(".menu-open,.icon-menu")) {
    menu.classList.remove("menu-open")
  }else{
   
  }
  
})