import acmLogo from "../assets/acm.jpg";
import algobLogo from "../assets/algob.jpg";
import codechefLogo from "../assets/codechef.jpg";
import ecellLogo from "../assets/ecell.jpg";
import gdscLogo from "../assets/gdsc.jpg";
import gfgLogo from "../assets/gfg.jpg";
import logosLogo from "../assets/logos.jpg";
import mscLogo from "../assets/msc.jpg";
import oscodeLogo from "../assets/oscode.jpg";
import thehravLogo from "../assets/thehrav.jpg";
import aayamLogo from "../assets/aayam.jpg";
import templeLogo from "../assets/temple.jpg";
import samarthyaLogo from "../assets/samarthya.jpg";
import nayanLogo from "../assets/nayan.jpg";
import innovocationLogo from "../assets/innovocation.png";

export const getClubLogo = (clubName: string) => {
  const name = (clubName || "").toLowerCase();
  
  if (name.includes("acm")) return acmLogo;
  if (name.includes("algo")) return algobLogo;
  if (name.includes("codechef")) return codechefLogo;
  if (name.includes("e-cell") || name.includes("ecell")) return ecellLogo;
  if (name.includes("gdsc")) return gdscLogo;
  if (name.includes("gfg") || name.includes("geeksforgeeks")) return gfgLogo;
  if (name.includes("logos")) return logosLogo;
  if (name.includes("msc")) return mscLogo;
  if (name.includes("oscode")) return oscodeLogo;
  if (name.includes("thehrav")) return thehravLogo;
  if (name.includes("aayam")) return aayamLogo;
  if (name.includes("temple")) return templeLogo;
  if (name.includes("samarthya")) return samarthyaLogo;
  if (name.includes("nayan")) return nayanLogo;
  if (name.includes("innovocation")) return innovocationLogo;
  
  // Fallback to null (the consumer can render an icon if null)
  return null;
};
