import { createComponent } from 'react-fela';

const buildingWrapper = () => ({
    display:'flex',
    alignItems: 'centre',
    flexDirection: 'column'
})
const BuildingWrapper = createComponent(buildingWrapper,'div')

export { BuildingWrapper }