const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// The list of pages that have been moved
const pages = [
  'Dashboard', 'ProfileHub', 'FinancialHub', 'SpecializedHub', 'Registration', 
  'Store', 'Gallery', 'FinancialTimeline', 'Verification', 'RegistrationHistory',
  'PersonalInfo', 'ContactInfo', 'PassportInfo', 'BankInfo', 'SportsInfo',
  'ClubInfo', 'ClothingInfo', 'Documents', 'Password', 'Attendance', 'Talent',
  'Insurance', 'InsuranceStatus', 'Certificate', 'Bulletin', 'TrainingBackpack'
];

let newImports = `import Login from './pages/Login';\nimport { useAuth } from './contexts/AuthContext';\n\n`;

pages.forEach(p => {
    newImports += `import Club${p} from './pages/club/${p}';\n`;
    newImports += `import School${p} from './pages/school/${p}';\n`;
});

// Remove old imports
content = content.replace(/import Login from '\.\/pages\/Login';[\s\S]*?import TrainingBackpack from '\.\/pages\/TrainingBackpack';/m, newImports);

// Create PanelRoute component
const panelRouteComponent = `
const PanelRoute = ({ ClubComponent, SchoolComponent }: { ClubComponent: any, SchoolComponent: any }) => {
  const { panelType } = useAuth();
  if (panelType === 'school') return <SchoolComponent />;
  return <ClubComponent />;
};
`;

content = content.replace('export default function App() {', panelRouteComponent + '\nexport default function App() {');

// Replace routes
pages.forEach(p => {
    const routeRegex = new RegExp(`element={<${p} \\/>}`, 'g');
    content = content.replace(routeRegex, `element={<PanelRoute ClubComponent={Club${p}} SchoolComponent={School${p}} />}`);
});

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.tsx updated successfully.');
