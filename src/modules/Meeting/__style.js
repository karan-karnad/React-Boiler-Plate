import { createComponent } from 'react-fela';

const buildingWrapper = () => ({
    display:'flex',
    alignItems: 'centre',
    flexDirection: 'column',
    width: '100%',
})

const sectionWrapper = () => ({
    height: '500px',
    width: '100%',
    display: 'flex',
    justifyContent: 'spaceEvenly',
    flexDirection: 'column'
})

const section = (active) => ({
    border: '1px solid',
    height: '50px',
    textAlign: 'center',
    backgroundColor: active || '#ffff',
})
const BuildingWrapper = createComponent(buildingWrapper,'div')
const SectionWrapper = createComponent(sectionWrapper,'div')
const Section = createComponent(section,'div',['onClick']) 


export { BuildingWrapper,SectionWrapper,Section }