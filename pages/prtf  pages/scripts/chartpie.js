const companyDataURL = 'https://script.google.com/macros/s/AKfycbwFnwtqazzVw8oQwCgkc4f5ep1Y6bSpnX-2uB8dBUCWAXrb4va7xvMjztyMeas7KUJL/exec';
    let chart = null;
    let processedData = null;
    fetch(companyDataURL)
      .then(response => response.json())
      .then(data => {
        processedData = data;
        const container = document.querySelector(".newscontent1table");
        if (!container) return;
        // Process fertilizer companies
        const fertilizerCompanies = data.filter(entry =>
          entry["entry type"] &&
          entry["entry type"].toLowerCase().trim() === "balance fertilization technique"
        );
        // Process seed companies
        const seedCompanies = data.filter(entry =>
          entry["entry type"] &&
          entry["entry type"].toLowerCase().includes("seed varietal demo")
        );
        // === TABLE GENERATION WITH PROPER GROUPING AND NUMBERING (MODIFIED) ===
        let html = "";
        // Fertilizer Companies Table with grouping and numbering (MODIFIED)
        if (fertilizerCompanies.length > 0) {
          html += `
            <h3>Companies Using Balance Fertilization Technique</h3>
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Product</th>
                  <th>Fertilizer Type</th>
                </tr>
              </thead>
              <tbody>
          `;
          // Group fertilizer entries by company
          const fertilizerByCompany = {};
          fertilizerCompanies.forEach(entry => {
            const company = entry["Company Name"] || "Unnamed Company";
            if (!fertilizerByCompany[company]) {
              fertilizerByCompany[company] = [];
            }
            fertilizerByCompany[company].push(entry);
          });
          // Sort companies alphabetically
          const sortedCompanies = Object.keys(fertilizerByCompany).sort();
          // Generate table rows with grouping and numbering (MODIFIED)
          sortedCompanies.forEach((company, companyIndex) => {
            const entries = fertilizerByCompany[company];
            entries.forEach((entry, entryIndex) => {
              const isFirstEntry = entryIndex === 0;
              const rowClass = isFirstEntry ? 'company-group-first' : '';
              html += `<tr class="${rowClass}">`;
              if (isFirstEntry) {
                // Add company name cell with counter only for the first entry
                html += `<td class="company-name-cell" rowspan="${entries.length}"><span class="company-counter"></span>${company}</td>`;
              }
              // Always add product and fertilizer type
              html += `
                <td>${entry["Product"] || ""}</td>
                <td>${entry["Fertilizer Type"] || ""}</td>
              </tr>
              `;
            });
          });
          html += `</tbody></table>`;
        } else {
          html += `<p>No companies using Balance Fertilization Technique.</p>`;
        }
        // Seed Companies Table with grouping and numbering (MODIFIED)
        if (seedCompanies.length > 0) {
          html += `
            <h3>Participating Seed Companies</h3>
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Product</th>
                </tr>
              </thead>
              <tbody>
          `;
          // Group seed entries by company
          const seedByCompany = {};
          seedCompanies.forEach(entry => {
            const company = entry["Company Name"] || "Unnamed Company";
            if (!seedByCompany[company]) {
              seedByCompany[company] = [];
            }
            seedByCompany[company].push(entry);
          });
          // Sort companies alphabetically
          const sortedSeedCompanies = Object.keys(seedByCompany).sort();
          // Generate table rows with grouping and numbering (MODIFIED)
          sortedSeedCompanies.forEach((company, companyIndex) => {
            const entries = seedByCompany[company];
            entries.forEach((entry, entryIndex) => {
              const isFirstEntry = entryIndex === 0;
              const rowClass = isFirstEntry ? 'company-group-first' : '';
              html += `<tr class="${rowClass}">`;
              if (isFirstEntry) {
                // Add company name cell with counter only for the first entry
                html += `<td class="company-name-cell" rowspan="${entries.length}"><span class="company-counter"></span>${company}</td>`;
              }
              // Always add product
              html += `
                <td>${entry["Product"] || ""}</td>
              </tr>
              `;
            });
          });
          html += `</tbody></table>`;
        } else {
          html += `<p>No seed companies listed.</p>`;
        }
        container.innerHTML = html;
        // Initialize counters
        const style = document.createElement('style');
        style.textContent = 'body { counter-reset: company-counter; }';
        document.head.appendChild(style);
        // Initialize the chart with the first view
        updateChart('view1');
      })
      .catch(error => {
        console.error("Error loading company data:", error);
        const container = document.querySelector(".news1content1");
        if (container) {
            container.innerHTML = "<p>Sorry, we couldn't load the participant data. Please try again later.</p>";
        }
      });
    // Function to generate colors based on fertilizer type
    function getFertilizerColor(type) {
      const typeLower = (type || '').toLowerCase();
      if (typeLower.includes('bio')) return '#2c6e49'; // Dark green for biofert
      if (typeLower.includes('soil')) return '#8B4513'; // Brown for soil ameliorant
      if (typeLower.includes('inorg')) return '#87CEEB'; // Sky blue for inorganic
      if (typeLower.includes('org') && !typeLower.includes('inorg')) return '#A52A2A'; // Red brown for organic
      return '#4c956c'; // Default green
    }
    // Function to generate colors for seed companies (various shades of yellow)
    function getSeedColor(index) {
      const yellowShades = [
        '#FFD700', // Gold
        '#FFA500', // Orange
        '#FF8C00', // Dark Orange
        '#FF7F50', // Coral
        '#FF6347', // Tomato
        '#FF4500', // Orange Red
        '#FFD700', // Gold (repeat if needed)
        '#FFA500', // Orange (repeat if needed)
      ];
      return yellowShades[index % yellowShades.length];
    }
    // Enhanced Doughnut Chart Function with custom colors
    function createDoughnutChart(canvasId, dataObj, title, subtitle, chartType = 'default') {
      const canvasEl = document.getElementById(canvasId);
      if (!canvasEl) return;
      // Destroy existing chart if it exists
      if (chart) {
        chart.destroy();
      }
      if (Object.keys(dataObj).length === 0) {
        canvasEl.parentElement.innerHTML = `
          <div class="no-data-box">No data available for ${title}</div>
        `;
        return;
      }
      // Sort data by value descending
      const sortedData = Object.entries(dataObj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Limit to top 10 for clarity
      const labels = sortedData.map(item => item[0]);
      const values = sortedData.map(item => item[1]);
      // Generate colors based on chart type
      let colors = [];
      if (chartType === 'fertilizer') {
        colors = labels.map(label => getFertilizerColor(label));
      } else if (chartType === 'seed') {
        colors = labels.map((_, index) => getSeedColor(index));
      } else if (chartType === 'entries') {
        // For Total Entries and Companies Count views
        colors = [ '#4c956c','#FFD700']; // Yellow for seed, Green for fertilizer
      } else {
        // Default color scheme for other charts
        const baseColors = [
          '#4c956c', '#2c6e49', '#fefee3', '#ffc857', '#e76f51',
          '#3d405b', '#81b29a', '#f2cc8f', '#9b5de5', '#00bbf9'
        ];
        colors = labels.map((_, i) => baseColors[i % baseColors.length]);
      }
      chart = new Chart(canvasEl, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 12
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 12,
                  family: 'Segoe UI'
                },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              titleFont: {
                size: 14,
                family: 'Segoe UI',
                weight: 'bold'
              },
              bodyFont: {
                size: 13,
                family: 'Segoe UI'
              },
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000
          }
        }
      });
    }
    // Update chart based on selected view
    function updateChart(view) {
      if (!processedData) return;
      // Update active button
      document.querySelectorAll('.chart-controls button').forEach(btn => {
        btn.classList.remove('active');
      });
      document.getElementById(view).classList.add('active');
      // Process data based on view
      const fertilizerCompanies = processedData.filter(entry =>
        entry["entry type"] &&
        entry["entry type"].toLowerCase().trim() === "balance fertilization technique"
      );
      const seedCompanies = processedData.filter(entry =>
        entry["entry type"] &&
        entry["entry type"].toLowerCase().includes("seed varietal demo")
      );
      let chartData = {};
      let title = "";
      let subtitle = "";
      let totalCount = 0;
      let chartType = 'default';
      switch(view) {
        case 'view1': // Total Entries
          chartData = {
            "Seed Varieties": seedCompanies.length,
            "Fertilizer Products": fertilizerCompanies.length
          };
          title = "PRTF Overall Entries";
          subtitle = "Balance Fertilization Technique vs Seed Varietal Demo";
          totalCount = fertilizerCompanies.length + seedCompanies.length;
          chartType = 'entries'; // Use yellow and green
          break;
        case 'view2': // Companies Count
          const fertilizerCompaniesSet = new Set(fertilizerCompanies.map(e => e["Company Name"] || "Unnamed Company"));
          const seedCompaniesSet = new Set(seedCompanies.map(e => e["Company Name"] || "Unnamed Company"));
          chartData = {
            "Seed Companies": seedCompaniesSet.size,
            "Fertilizer Companies": fertilizerCompaniesSet.size
          };
          title = "Companies Participation";
          subtitle = "Number of Companies";
          totalCount = fertilizerCompaniesSet.size + seedCompaniesSet.size;
          chartType = 'entries'; // Use yellow and green
          break;
        case 'view3': // Seed Entries
          const seedCompanyCount = {};
          seedCompanies.forEach(entry => {
            const company = entry["Company Name"] || "Unnamed Company";
            seedCompanyCount[company] = (seedCompanyCount[company] || 0) + 1;
          });
          chartData = seedCompanyCount;
          title = "Seed Varietal Demo Companies";
          subtitle = "Entries per Company";
          totalCount = seedCompanies.length;
          chartType = 'seed'; // Use various shades of yellow
          break;
        case 'view4': // Fertilizer Entries
          const fertilizerTypeCount = {};
          fertilizerCompanies.forEach(entry => {
            const type = entry["Fertilizer Type"] ? entry["Fertilizer Type"].trim() : "Other Fertilizer";
            fertilizerTypeCount[type] = (fertilizerTypeCount[type] || 0) + 1;
          });
          chartData = fertilizerTypeCount;
          title = "Fertilizer Types Distribution";
          subtitle = "Entries by Fertilizer Type";
          totalCount = fertilizerCompanies.length;
          chartType = 'fertilizer'; // Use specific fertilizer colors
          break;
      }
      // Update chart elements
      document.getElementById('chartTitle').textContent = title;
      document.getElementById('chartSubtitle').textContent = subtitle;
      document.getElementById('chartTotalCount').textContent = `Total Entries: ${totalCount}`;
      // Create the chart
      createDoughnutChart("dynamicChart", chartData, title, subtitle, chartType);
    }