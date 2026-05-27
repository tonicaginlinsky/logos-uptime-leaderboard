import { geoNaturalEarth1, geoPath } from "d3-geo";
import * as topojson from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import fs from "node:fs";
import path from "node:path";

// ISO 3166-1 numeric (zero-padded) → alpha-2
export const NUMERIC_TO_ALPHA2: Record<string, string> = {
  "004": "AF", "008": "AL", "012": "DZ", "024": "AO", "032": "AR",
  "036": "AU", "040": "AT", "031": "AZ", "050": "BD", "056": "BE",
  "068": "BO", "070": "BA", "072": "BW", "076": "BR", "096": "BN",
  "100": "BG", "104": "MM", "112": "BY", "116": "KH", "120": "CM",
  "124": "CA", "140": "CF", "144": "LK", "152": "CL", "156": "CN",
  "158": "TW", "170": "CO", "178": "CG", "180": "CD", "188": "CR",
  "191": "HR", "192": "CU", "196": "CY", "203": "CZ", "208": "DK",
  "214": "DO", "218": "EC", "818": "EG", "231": "ET", "246": "FI",
  "250": "FR", "262": "DJ", "266": "GA", "268": "GE", "276": "DE",
  "288": "GH", "300": "GR", "320": "GT", "324": "GN", "332": "HT",
  "340": "HN", "344": "HK", "348": "HU", "356": "IN", "360": "ID",
  "364": "IR", "368": "IQ", "372": "IE", "376": "IL", "380": "IT",
  "388": "JM", "392": "JP", "400": "JO", "398": "KZ", "404": "KE",
  "408": "KP", "410": "KR", "414": "KW", "417": "KG", "422": "LB",
  "426": "LS", "430": "LR", "434": "LY", "446": "MO", "450": "MG",
  "454": "MW", "458": "MY", "466": "ML", "478": "MR", "484": "MX",
  "496": "MN", "498": "MD", "499": "ME", "504": "MA", "508": "MZ",
  "516": "NA", "524": "NP", "528": "NL", "540": "NC", "554": "NZ",
  "558": "NI", "562": "NE", "566": "NG", "578": "NO", "586": "PK",
  "591": "PA", "598": "PG", "600": "PY", "604": "PE", "608": "PH",
  "616": "PL", "620": "PT", "630": "PR", "642": "RO", "643": "RU",
  "646": "RW", "682": "SA", "686": "SN", "688": "RS", "694": "SL",
  "703": "SK", "704": "VN", "705": "SI", "706": "SO", "710": "ZA",
  "716": "ZW", "724": "ES", "752": "SE", "756": "CH", "760": "SY",
  "762": "TJ", "764": "TH", "784": "AE", "788": "TN", "792": "TR",
  "795": "TM", "800": "UG", "804": "UA", "807": "MK", "826": "GB",
  "834": "TZ", "840": "US", "858": "UY", "860": "UZ", "862": "VE",
  "887": "YE", "894": "ZM", "051": "AM",
};

export interface CountryPath {
  id: string;
  alpha2: string | null;
  d: string;
}

export function buildCountryPaths(): CountryPath[] {
  const W = 960;
  const H = 480;

  const topoFile = path.join(process.cwd(), "public", "countries-110m.json");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topo = JSON.parse(fs.readFileSync(topoFile, "utf-8")) as any;

  const projection = geoNaturalEarth1()
    .scale(153)
    .translate([W / 2, H / 2]);
  const pathGen = geoPath(projection);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geojson = topojson.feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>;

  const result: CountryPath[] = [];
  for (const feature of geojson.features) {
    const numericId = String(feature.id ?? "").padStart(3, "0");
    const d = pathGen(feature);
    if (!d) continue;
    result.push({
      id: numericId,
      alpha2: NUMERIC_TO_ALPHA2[numericId] ?? null,
      d,
    });
  }
  return result;
}
