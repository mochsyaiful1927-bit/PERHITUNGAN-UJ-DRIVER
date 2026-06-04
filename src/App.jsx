import { useState } from "react";
import { tarifData } from "./data/tarif";

function App() {
  const [kendaraan, setKendaraan] = useState("TWB");
  const [jenisOrder, setJenisOrder] = useState("MUATAN");
  const [tonase, setTonase] = useState("");
  const [km, setKm] = useState("");
  const [kmTol, setKmTol] = useState("");
  const [waktu, setWaktu] = useState("");
  const [driver, setDriver] = useState("1");
  const [titikAsam, setTitikAsam] = useState("");
  const [tol, setTol] = useState("");

  const berat = Number(tonase);
  const kilometer = Number(km);
  const kilometerTol = Number(kmTol);
  const titik = Number(titikAsam);

  // RATIO
  let ratio = 0;

  if (kendaraan === "TWB") {
    if (berat === 0) ratio = 4;
    else if (berat <= 12) ratio = 3;
    else if (berat <= 16) ratio = 2.9;
    else if (berat <= 20) ratio = 2.8;
    else ratio = 2.7;
  }

  if (kendaraan === "CDDL") {
    if (berat <= 5) ratio = 6;
    else if (berat <= 6) ratio = 5.5;
    else ratio = 5;
  }

  // SOLAR
  const solarDasar =
    ratio > 0 ? (kilometer / ratio) * 6800 : 0;

  const solar10 =
    berat > 0 ? solarDasar * 0.1 : 0;

  const totalSolar = solarDasar + solar10;

  const solar =
    Math.floor(totalSolar / 10000) * 10000;

  // ASAM
  let asam = 0;

  if (kendaraan === "TWB") {
    asam = Math.min(titik * 50000, 150000);
  } else {
    asam = Math.min(titik * 20000, 60000);
  }

  // SLA
  let sla = 0;

  if (kendaraan === "TWB") {
    sla =
      berat <= 12
        ? Number(waktu) * 1.75
        : Number(waktu) * 2;
  } else {
    sla = Number(waktu) * 1.5;
  }

  const slaRanges = [
    [0, 3, "0-3 Jam"],
    [3, 6, "3-6 Jam"],
    [6, 12, "6-12 Jam"],
    [12, 18, "12-18 Jam"],
    [18, 24, "18-24 Jam"],
    [24, 36, "24-36 Jam"],
    [36, 48, "36-48 Jam"],
    [48, 60, "48-60 Jam"],
    [60, 72, "60-72 Jam"],
    [72, 84, "72-84 Jam"],
    [84, 96, "84-96 Jam"],
    [96, 108, "96-108 Jam"],
    [108, 120, "108-120 Jam"],
    [120, 132, "120-132 Jam"],
    [132, 144, "132-144 Jam"],
    [144, 156, "144-156 Jam"],
    [156, 168, "156-168 Jam"],
  ];

  let slaRange = "-";

  for (const [min, max, label] of slaRanges) {
    if (sla >= min && sla <= max) {
      slaRange = label;
      break;
    }
  }

  // UPAH
  let upah = 0;
  let metodeUpah = "-";

  try {
    if (jenisOrder === "KOSONGAN") {
      upah =
        tarifData[kendaraan]
          .KOSONGAN[slaRange][driver];

      metodeUpah = "KOSONGAN";
    } else {
      const persenTol =
        kilometer > 0
          ? (kilometerTol / kilometer) * 100
          : 0;

      const reguler =
        tarifData[kendaraan]
          .REGULER[slaRange][driver];

      const fullTol =
        tarifData[kendaraan]
          ["FULL TOL"][slaRange][driver];

      if (persenTol <= 25) {
        upah = reguler;
        metodeUpah = "REGULER";
      } else if (persenTol >= 75) {
        upah = fullTol;
        metodeUpah = "FULL TOL";
      } else {
        upah =
          Math.round(
            (reguler + fullTol) / 2
          );

        metodeUpah =
          "RATA-RATA REGULER & FULL TOL";
      }
    }
  } catch {
    upah = 0;
  }

  const persenTol =
    kilometer > 0
      ? (kilometerTol / kilometer) * 100
      : 0;

  const total =
    solar +
    upah +
    asam +
    Number(tol || 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>Kalkulator Uang Jalan Driver</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "#1f2937",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Input Data</h2>

          <p>Kendaraan</p>
          <select
            value={kendaraan}
            onChange={(e) =>
              setKendaraan(e.target.value)
            }
          >
            <option>TWB</option>
            <option>CDDL</option>
          </select>

          <p>Jenis Order</p>
          <select
            value={jenisOrder}
            onChange={(e) =>
              setJenisOrder(e.target.value)
            }
          >
            <option value="MUATAN">
              MUATAN
            </option>
            <option value="KOSONGAN">
              KOSONGAN
            </option>
          </select>

          <p>Tonase</p>
          <input
            type="number"
            value={tonase}
            onChange={(e) =>
              setTonase(e.target.value)
            }
          />

          <p>Total Kilometer</p>
          <input
            type="number"
            value={km}
            onChange={(e) =>
              setKm(e.target.value)
            }
          />

          <p>Kilometer Tol</p>
          <input
            type="number"
            value={kmTol}
            onChange={(e) =>
              setKmTol(e.target.value)
            }
          />

          <p>Waktu Tempuh (Jam)</p>
          <input
            type="number"
            value={waktu}
            onChange={(e) =>
              setWaktu(e.target.value)
            }
          />

          <p>Jumlah Driver</p>
          <select
            value={driver}
            onChange={(e) =>
              setDriver(e.target.value)
            }
          >
            <option value="1">
              1 Driver
            </option>
            <option value="2">
              2 Driver
            </option>
          </select>

          <p>Titik Asam</p>
          <input
            type="number"
            value={titikAsam}
            onChange={(e) =>
              setTitikAsam(e.target.value)
            }
          />

          <p>Nominal Tol</p>
          <input
            type="number"
            value={tol}
            onChange={(e) =>
              setTol(e.target.value)
            }
          />
        </div>

        <div
          style={{
            background: "#1f2937",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Hasil</h2>

          <p>SLA : {sla.toFixed(2)} Jam</p>

          <p>RANGE : {slaRange}</p>

          <p>
            % TOL :
            {persenTol.toFixed(1)}%
          </p>

          <p>
            METODE :
            {metodeUpah}
          </p>

          <hr />

          <p>
            SOLAR : Rp
            {solar.toLocaleString("id-ID")}
          </p>

          <p>
            UPAH : Rp
            {upah.toLocaleString("id-ID")}
          </p>

          <p>
            ASAM : Rp
            {asam.toLocaleString("id-ID")}
          </p>

          <p>
            TOL : Rp
            {Number(tol || 0).toLocaleString(
              "id-ID"
            )}
          </p>

          <hr />

          <h2>
            TOTAL : Rp
            {total.toLocaleString("id-ID")}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default App;