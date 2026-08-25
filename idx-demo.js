const properties = [
  { id:1, address:"1842 Juniper Street", city:"Denver", neighborhood:"City Park", price:625000, beds:3, baths:2, sqft:1680, type:"Bungalow", colors:["#8bbbe2","#d9e9ff"], features:["Updated kitchen","Covered porch","Walkable location"], description:"A bright fictional bungalow with flexible living space, mature trees, and quick access to neighborhood parks." },
  { id:2, address:"77 Willow Lane", city:"Lakewood", neighborhood:"Belmar", price:515000, beds:2, baths:2, sqft:1340, type:"Townhome", colors:["#c8ef9f","#e8f7d8"], features:["End unit","Attached garage","Private patio"], description:"A low-maintenance fictional townhome with an open main floor and a quiet outdoor patio." },
  { id:3, address:"901 Pearl Avenue", city:"Denver", neighborhood:"Capitol Hill", price:439000, beds:2, baths:1, sqft:980, type:"Condo", colors:["#ffb6d2","#ffe3ee"], features:["Corner unit","City views","Secure entry"], description:"A fictional corner condo pairing historic character with an efficient, light-filled layout." },
  { id:4, address:"312 Mesa Court", city:"Golden", neighborhood:"South Table", price:885000, beds:4, baths:3, sqft:2420, type:"Single Family", colors:["#f4c98b","#faead1"], features:["Mountain views","Home office","Two-car garage"], description:"A fictional foothills home designed around mountain views, gathering spaces, and everyday flexibility." },
  { id:5, address:"48 Grove Terrace", city:"Arvada", neighborhood:"Olde Town", price:710000, beds:3, baths:2, sqft:1915, type:"Ranch", colors:["#b7a1e5","#e8e0f8"], features:["Single-level living","Large yard","Solar panels"], description:"A fictional updated ranch with accessible single-level circulation and a generous backyard." },
  { id:6, address:"2250 River Walk", city:"Denver", neighborhood:"Highland", price:795000, beds:3, baths:3, sqft:1820, type:"Townhome", colors:["#8ed7cf","#d9f3ef"], features:["Rooftop deck","Energy efficient","River access"], description:"A fictional contemporary townhome with layered outdoor spaces and connections to nearby trails." },
  { id:7, address:"630 Aspen View", city:"Golden", neighborhood:"Applewood", price:940000, beds:4, baths:3, sqft:2760, type:"Mid-century", colors:["#e7a78f","#f7ddd4"], features:["Original details","Garden studio","Fireplace"], description:"A fictional mid-century home balancing preserved details with flexible creative space." },
  { id:8, address:"16 Clay Street", city:"Denver", neighborhood:"Baker", price:565000, beds:2, baths:2, sqft:1210, type:"Row House", colors:["#f2d47c","#fbf0c9"], features:["Historic brick","Courtyard","Bike storage"], description:"A compact fictional row house with warm historic materials and a private interior courtyard." },
  { id:9, address:"408 Fieldstone Road", city:"Lakewood", neighborhood:"Green Mountain", price:675000, beds:3, baths:2, sqft:2050, type:"Split Level", colors:["#91b7a4","#dcebe4"], features:["Trail access","Workshop","Native garden"], description:"A fictional west-side home with trail access, project space, and a low-water landscape." },
  { id:10, address:"1209 Elm Place", city:"Arvada", neighborhood:"Candelas", price:820000, beds:4, baths:3, sqft:2510, type:"Contemporary", colors:["#a4b9da","#e0e8f4"], features:["Flexible loft","EV charging","Community pool"], description:"A fictional contemporary home with adaptable rooms and energy-conscious amenities." },
  { id:11, address:"52 Logan Square", city:"Denver", neighborhood:"Washington Park", price:995000, beds:4, baths:3, sqft:2380, type:"Craftsman", colors:["#d7a8bb","#f0dce4"], features:["Restored woodwork","Finished basement","Near park"], description:"A fictional restored craftsman combining original woodwork with comfortable modern living." },
  { id:12, address:"730 Canyon Point", city:"Golden", neighborhood:"North Table", price:760000, beds:3, baths:2, sqft:1865, type:"Courtyard Home", colors:["#a9cfd8","#e0f0f3"], features:["Step-free entry","Central courtyard","Wide doorways"], description:"A fictional courtyard home designed with step-free access, generous circulation, and indoor-outdoor connection." }
];

const $ = (selector) => document.querySelector(selector);
const grid = $("#listing-grid");
const pagination = $("#pagination");
const dialog = $("#property-dialog");
const perPage = 6;
let page = 1;

const money = (value) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(value);
const citySelect = $("#city");
[...new Set(properties.map((property) => property.city))].sort().forEach((city) => citySelect.add(new Option(city, city)));

function filteredProperties() {
  const query = $("#search").value.trim().toLowerCase();
  const city = citySelect.value;
  const min = Number($("#min-price").value);
  const max = Number($("#max-price").value);
  const beds = Number($("#beds").value);
  const sort = $("#sort").value;
  const results = properties.filter((property) => {
    const searchable = [property.address, property.city, property.neighborhood, property.type, ...property.features].join(" ").toLowerCase();
    return (!query || searchable.includes(query)) && (!city || property.city === city) && property.price >= min && property.price <= max && property.beds >= beds;
  });
  if (sort === "price-low") results.sort((a,b) => a.price - b.price);
  if (sort === "price-high") results.sort((a,b) => b.price - a.price);
  return results;
}

function render() {
  const results = filteredProperties();
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  if (page > totalPages) page = totalPages;
  $("#result-count").textContent = `${results.length} ${results.length === 1 ? "property" : "properties"}`;
  const visible = results.slice((page - 1) * perPage, page * perPage);
  grid.innerHTML = visible.length ? visible.map((property) => `
    <article class="listing-card">
      <div class="listing-visual" style="--card-a:${property.colors[0]};--card-b:${property.colors[1]}"><span>${property.type.toUpperCase()}</span></div>
      <div class="listing-body">
        <p class="listing-price">${money(property.price)}</p>
        <p class="listing-address">${property.address}<br>${property.city} · ${property.neighborhood}</p>
        <div class="listing-facts"><span>${property.beds} beds</span><span>${property.baths} baths</span><span>${property.sqft.toLocaleString()} sq ft</span></div>
        <button class="detail-button" type="button" data-property-id="${property.id}">View details</button>
      </div>
    </article>`).join("") : `<div class="empty-state"><h3>No matching properties</h3><p>Try clearing a filter or searching for something broader.</p></div>`;
  pagination.innerHTML = totalPages > 1 ? Array.from({length:totalPages},(_,index) => `<button type="button" data-page="${index+1}" ${page === index+1 ? 'aria-current="page"' : ""} aria-label="Page ${index+1}">${index+1}</button>`).join("") : "";
}

function openProperty(id) {
  const property = properties.find((item) => item.id === id);
  $("#dialog-content").innerHTML = `
    <div class="dialog-visual" style="--card-a:${property.colors[0]};--card-b:${property.colors[1]}"><span>FICTIONAL ${property.type.toUpperCase()}</span></div>
    <div class="dialog-body"><p class="listing-price">${money(property.price)}</p><h2>${property.address}</h2><p class="listing-address">${property.city} · ${property.neighborhood}</p><div class="listing-facts"><span>${property.beds} beds</span><span>${property.baths} baths</span><span>${property.sqft.toLocaleString()} sq ft</span></div><p class="dialog-description">${property.description}</p><ul class="dialog-features">${property.features.map((feature) => `<li>${feature}</li>`).join("")}</ul></div>`;
  dialog.showModal();
}

$("#filters").addEventListener("input", () => { page = 1; render(); });
$("#filters").addEventListener("reset", () => setTimeout(() => { page = 1; render(); }));
$("#sort").addEventListener("change", () => { page = 1; render(); });
grid.addEventListener("click", (event) => { const button = event.target.closest("[data-property-id]"); if (button) openProperty(Number(button.dataset.propertyId)); });
pagination.addEventListener("click", (event) => { const button = event.target.closest("[data-page]"); if (button) { page = Number(button.dataset.page); render(); $("#results").focus(); } });
$(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
render();
