import React from 'react'
import './ClassIcons.css'

export const IconHeavy = () => <i className="TF2ClassIcons tf2-Heavy"/>
export const IconMedic = () => <i className="TF2ClassIcons tf2-Medic"/>
export const IconPyro = () => <i className="TF2ClassIcons tf2-Pyro"/>
export const IconScout = () => <i className="TF2ClassIcons tf2-Scout"/>
export const IconSniper = () => <i className="TF2ClassIcons tf2-Sniper"/>
export const IconSoldier = () => <i className="TF2ClassIcons tf2-Soldier"/>
export const IconSpy = () => <i className="TF2ClassIcons tf2-Spy"/>
export const IconDemo = () => <i className="TF2ClassIcons tf2-Demo"/>
export const IconEngineer = () => <i className="TF2ClassIcons tf2-Engineer"/>
export const IconFlankSoldier = () => <i className="TF2ClassIcons tf2-FlankSoldier"/>
export const IconPocketSoldier = () => <i className="TF2ClassIcons tf2-PocketSoldier"/>
export const IconFlankScout = () => <i className="TF2ClassIcons tf2-FlankScout"/>
export const IconPocketScout = () => <i className="TF2ClassIcons tf2-PocketScout"/>

export const getClassIcon = {
	scout: () => <IconScout/>,
	soldier: () => <IconSoldier/>,
	pyro: () => <IconPyro/>,
	demoman: () => <IconDemo/>,
	heavyweapons: () => <IconHeavy/>,
	engineer: () => <IconEngineer/>,
	medic: () => <IconMedic/>,
	sniper: () => <IconSniper/>,
	spy: () => <IconSpy/>,
	flankSoldier: () => <IconFlankSoldier/>,
	flankScout: () => <IconFlankScout/>,
	pocketSoldier: () => <IconPocketSoldier/>,
	pocketScout: () => <IconPocketScout/>,
}