import meleeIcon from "./assets/meleeIcon.png";
import rangedIcon from "./assets/rangedIcon.png";
import { Arrow } from "./assets/icons";

export const Weapons = ({ title, weapons, modelStats }) => {
	const isMelee = title === "MELEE WEAPONS";
	return (
		<>
			{weapons.length > 0 && (
				<thead>
					<tr
						style={{
							backgroundColor: "var(--primary-color)",
							color: "#fff",
						}}
					>
						<th style={{ width: 37 }}>
							<div style={{ display: "flex" }}>
								<img src={isMelee ? meleeIcon : rangedIcon} />
							</div>
						</th>
						<th style={{ textAlign: "left", width: "44%" }}>{title}</th>
						<th>RANGE</th>
						<th>A</th>
						<th>{isMelee ? "WS" : "BS"}</th>
						<th>S</th>
						<th>AP</th>
						<th>D</th>
					</tr>
				</thead>
			)}
			<tbody>
				{weapons.map((weapon, index) => (
					<Weapon
						key={weapon.name}
						weapon={weapon}
						modelStats={modelStats}
						isMelee={isMelee}
						className={getWeaponClassNames(weapons, index)}
					/>
				))}
				{weapons.length > 0 && (
					<tr className="emptyRow">
						<td style={{ width: 37, borderTop: "none" }}></td>
						<td colSpan={7}></td>
					</tr>
				)}
			</tbody>
		</>
	);
};

const Weapon = ({ weapon, modelStats, isMelee, className }) => {
	let { name, selectionName, range, type, str, ap, damage, abilities } = weapon;
	var lastWhiteSpace = type.lastIndexOf(" ");
	const attacks = type.substring(lastWhiteSpace + 1);
	type = type.substring(0, lastWhiteSpace);

	const bs = modelStats[0].bs;
	const ws = modelStats[0].ws;
	const strModel = modelStats[0].str;
	const meleeAttacks = modelStats[0].attacks;

	if (name === "Krak grenades") {
		name = "Krak grenade";
	}
	const differentProfiles =
		selectionName !== name &&
		!name.includes("(Shooting)") &&
		!name.includes("(Melee)");
	const interestingType = type && type !== "Melee";
	if (differentProfiles && name.endsWith(" grenades")) {
		name = name.replace(" grenades", "");
	}
	if (differentProfiles && name.endsWith(" grenade")) {
		name = name.replace(" grenade", "");
	}
	if (differentProfiles && name.includes(" - ")) {
		name = name.split(" - ")[1];
	}

	if (abilities === "Blast") {
		abilities = abilities.replaceAll("Blast", "");
		type += ", Blast";
	}

	return (
		<>
			<tr className={className}>
				<td style={{ borderTop: "none", backgroundColor: "#dfe0e2" }}>
					{differentProfiles && Arrow}
				</td>
				<td style={{ textAlign: "left" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							flexWrap: "wrap",
							gap: "0 4px",
						}}
					>
						{differentProfiles && selectionName + " - "}
						{name}
						{interestingType && (
							<span
								style={{
									fontSize: ".8em",
									fontWeight: 700,
									color: "var(--primary-color)",
								}}
							>
								[{type}]
							</span>
						)}
					</div>
				</td>
				<td>{range}</td>
				<td>{isMelee ? meleeAttacks : attacks}</td>
				<td>{isMelee ? ws : bs}</td>
				<td>{isMelee ? calculateWeaponStrength(strModel, str) : str}</td>
				<td>{ap}</td>
				<td>{damage}</td>
			</tr>
			{abilities && abilities !== "-" && (
				<tr className={className + " " + "noBorderTop"}>
					<td style={{ backgroundColor: "#dfe0e2" }}></td>
					<td
						colSpan="7"
						style={{
							textAlign: "left",
							fontSize: "0.9em",
							paddingTop: 0,
							paddingBottom: 1,
							lineHeight: 1.4,
						}}
					>
						{abilities}
					</td>
				</tr>
			)}
		</>
	);
};

const getWeaponClassNames = (weapons, index) => {
	let differentColor = false;
	for (let i = 1; i <= index; i++) {
		let { selectionName } = weapons[i];
		if (selectionName !== weapons[i - 1].selectionName) {
			differentColor = !differentColor;
		}
	}
	const classes = [];
	if (differentColor) classes.push("rowOtherColor");
	if (index === 0) classes.push("noBorderTop");
	if (
		index > 0 &&
		weapons[index].selectionName === weapons[index - 1].selectionName
	)
		classes.push("noBorderTop");
	return classes.join(" ");
};

const calculateWeaponStrength = (strModel, strWeapon) => {
	if (strWeapon.startsWith("User")) return strModel;
	if (strWeapon.startsWith("x"))
		return strModel * parseInt(strWeapon.replace("x", ""));
	return strModel + parseInt(strWeapon, 10);
};