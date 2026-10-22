import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logo from "@/assets/logo.png.asset.json";

const nav = [{to:"/",label:"Board"},{to:"/edges",label:"Edges"},{to:"/why",label:"Breakdowns"},{to:"/record",label:"Record"},{to:"/about",label:"How it works"}] as const;
export function Header() {
 const location = useLocation();
 const sport = location.search["sport"] === "NFL" ? "NFL" : "NBA";
 const current = location.pathname.startsWith("/game/") ? "/" : location.pathname.startsWith("/why") ? "/why" : location.pathname;
 const to = current === "/edges" ? "/edges" : current === "/record" ? "/record" : current === "/why" ? "/why" : current === "/about" ? "/about" : "/";
 return <><header className="bar"><div className="wrap"><Link to="/" search={{sport}} className="home" aria-label="Profit Pilot home"><img className="logo" alt="Profit Pilot" src={logo.url}/></Link><nav aria-label="Sections">{nav.map(n=><Link key={n.to} to={n.to} search={{sport}} aria-current={current===n.to ? "page" : undefined}>{n.label}</Link>)}</nav></div></header><div className="subbar"><div className="wrap" role="group" aria-label="Sport">{(["NBA","NFL"] as const).map(s=><Link key={s} to={to} search={{sport:s}} aria-current={sport===s ? "true" : undefined}>{s}</Link>)}</div></div></>;
}
export function Footer(){return <footer><div className="wrap"><div><b>Profit Pilot</b> · free projections by <a href="https://x.com/TeejTradez" target="_blank" rel="noopener">@TeejTradez</a> · <a href="https://teejtradez.substack.com" target="_blank" rel="noopener">Free Money Sheet newsletter</a></div><div>Model output, not betting advice. All odds are estimated. Prices move; shop your number. 21+. If you or someone you know has a gambling problem, call 1-800-GAMBLER.</div></div></footer>}
export function Page({eyebrow,title,intro,children}:{eyebrow:string;title:string;intro?:ReactNode;children:ReactNode}){return <main className="wrap"><section className="intro"><p className="lab">{eyebrow}</p><h1>{title}</h1>{intro&&<p className="lede">{intro}</p>}</section>{children}</main>}
export function Empty({children}:{children:ReactNode}){return <div className="empty">{children}</div>}
export function ErrorBox({error}:{error:unknown}){return <Empty>Couldn't load the latest numbers. {error instanceof Error ? error.message : ""}</Empty>}
