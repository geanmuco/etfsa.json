document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const etfContainer = document.getElementById("etf-container");

  let etfs = [];
  let allCategories = new Set();

  const fetchData = async () => {
    try {
      const response = await fetch("data/etfsa.json");
      const data = await response.json();
      etfs = [
        ...data.etfs,
        ...data.ametfs,
        ...data.etns,
        ...data.amcs,
      ];
      populateCategories();
      renderETFs();
    } catch (error) {
      console.error("Error fetching ETF data:", error);
    }
  };

  const populateCategories = () => {
    etfs.forEach((etf) => allCategories.add(etf.category));
    allCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  };

  const renderETFs = () => {
    etfContainer.innerHTML = "";
    const searchValue = searchInput.value.toLowerCase();
    const typeValue = typeFilter.value;
    const categoryValue = categoryFilter.value;

    const filteredETFs = etfs.filter((etf) => {
      const matchesSearch =
        etf.name.toLowerCase().includes(searchValue) ||
        etf.ticker.toLowerCase().includes(searchValue);
      const matchesType = !typeValue || etf.type === typeValue;
      const matchesCategory = !categoryValue || etf.category === categoryValue;
      return matchesSearch && matchesType && matchesCategory;
    });

    filteredETFs.forEach((etf) => {
      const card = document.createElement("div");
      card.className = "etf-card";
      card.innerHTML = `
        <h2>${etf.name}</h2>
        <p class="ticker">Ticker: ${etf.ticker}</p>
        <p class="type">Type: ${etf.type}</p>
        <p class="category">${etf.category}</p>
        <p>${etf.description}</p>
      `;
      etfContainer.appendChild(card);
    });
  };

  searchInput.addEventListener("input", renderETFs);
  typeFilter.addEventListener("change", renderETFs);
  categoryFilter.addEventListener("change", renderETFs);

  fetchData();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
});
