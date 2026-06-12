Highcharts.chart("grafico-miembros-dia", {
  chart: {
    type: "line",
  },
  title: {
    text: "Cantidad de miembros registrados por día",
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      day: "%e-%m-%Y",
      month: "%e-%m-%Y",
    },
    title: {
      text: "Día",
    },
  },
  yAxis: {
    title: {
      text: "Cantidad de miembros",
    },
    allowDecimals: false,
  },
  legend: {
    align: "left",
    verticalAlign: "top",
    borderWidth: 0,
  },
  tooltip: {
    shared: true,
    crosshairs: true,
  },
  series: [
    {
      name: "Miembros",
      data: [],
      lineWidth: 1,
      marker: {
        enabled: true,
        radius: 4,
      },
      color: "#ec7a9c",
    },
  ],
});

fetch("/api/estadisticas/miembros-por-dia")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudieron cargar las estadísticas");
    }

    return response.json();
  })
  .then((data) => {
    if (data.length === 0) {
      document.getElementById("mensaje-miembros-dia").textContent =
        "Todavía no hay miembros registrados.";
      return;
    }

    let parsedData = data.map((item) => {
      const [year, month, day] = item.dia
        .split("-")
        .map((part) => parseInt(part, 10));

      return [
        Date.UTC(year, month - 1, day),
        item.cantidad,
      ];
    });

    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-miembros-dia"
    );

    chart.update({
      series: [
        {
          data: parsedData,
        },
      ],
    });

    document.getElementById("mensaje-miembros-dia").textContent = "";
  })
  .catch((error) => {
    console.error("Error:", error);

    document.getElementById("mensaje-miembros-dia").textContent =
      "No se pudo cargar el gráfico.";
  });

Highcharts.chart("grafico-actividades-tipo", {
  chart: {
    type: "pie",
  },
  title: {
    text: "Actividades por tipo",
  },
  tooltip: {
    pointFormat: "<b>{point.y}</b> actividades ({point.percentage:.1f}%)",
  },
  series: [
    {
      name: "Actividades",
      data: [],
      colorByPoint: true,
    },
  ],
});

fetch("/api/estadisticas/actividades-por-tipo")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudieron cargar las estadísticas");
    }

    return response.json();
  })
  .then((data) => {
    if (data.length === 0) {
      document.getElementById("mensaje-actividades-tipo").textContent =
        "Todavía no hay actividades registradas.";
      return;
    }

    let parsedData = data.map((item) => {
      return {
        name: item.tipo,
        y: item.cantidad,
      };
    });

    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-actividades-tipo"
    );

    chart.update({
      series: [
        {
          data: parsedData,
        },
      ],
    });

    document.getElementById("mensaje-actividades-tipo").textContent = "";
  })
  .catch((error) => {
    console.error("Error:", error);

    document.getElementById("mensaje-actividades-tipo").textContent =
      "No se pudo cargar el gráfico.";
  });

Highcharts.chart("grafico-actividades-comuna", {
  chart: {
    type: "bar",
  },
  title: {
    text: "Total de Actividades Registradas por Comuna",
  },
  xAxis: {
    categories: [],
    title: {
      text: "Comunas",
    },
  },
  yAxis: {
    min: 0,
    allowDecimals: false,
    title: {
      text: "Total de Actividades",
    },
  },
  series: [
    {
      name: "Actividades",
      data: [],
      color: "#ec7a9c",
    },
  ],
});

fetch("/api/estadisticas/actividades-por-comuna")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudieron cargar las estadísticas");
    }

    return response.json();
  })
  .then((data) => {
    if (data.length === 0) {
      document.getElementById("mensaje-actividades-comuna").textContent =
        "Todavía no hay actividades registradas por comuna.";
      return;
    }

    let comunas = data.map((item) => item.comuna);
    let cantidades = data.map((item) => item.cantidad);

    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-actividades-comuna"
    );

    chart.update({
      xAxis: {
        categories: comunas,
      },
      series: [
        {
          data: cantidades,
        },
      ],
    });

    document.getElementById("mensaje-actividades-comuna").textContent = "";
  })
  .catch((error) => {
    console.error("Error:", error);

    document.getElementById("mensaje-actividades-comuna").textContent =
      "No se pudo cargar el gráfico.";
  });
