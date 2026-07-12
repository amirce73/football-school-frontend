const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/SportsInfo.tsx',
    'src/pages/PersonalInfo.tsx',
    'src/pages/PassportInfo.tsx',
    'src/pages/ContactInfo.tsx',
    'src/pages/BankInfo.tsx',
    'src/pages/TrainingBackpack.tsx',
    'src/pages/Registration.tsx'
];

for (const file of files) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
        console.log(`Skipping ${file} - not found`);
        continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. Add import if not exists
    if (!content.includes('useFormDraft')) {
        content = content.replace(/(import { useForm.*? } from 'react-hook-form';)/, "$1\nimport { useFormDraft } from '../hooks/useFormDraft';");
    }

    // 2. Change useForm<any> destructuring to methods
    // Original: const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
    // New: const methods = useForm<any>({ ...
    // And add destructuring below it.
    if (!content.includes('const methods = useForm')) {
        // Regex to catch the whole destructuring part before useForm
        const useFormRegex = /const\s+\{\s*([^}]+)\s*\}\s*=\s*useForm(<.*?>)?\(\{/g;
        content = content.replace(useFormRegex, (match, destructured, generics) => {
            // We need to ensure `watch` is in the destructured list
            let parts = destructured.split(',').map(s => s.trim());
            if (!parts.includes('watch')) {
                // Insert watch before formState if exists, or at the end
                parts.push('watch');
            }
            if (!parts.includes('reset')) {
                parts.push('reset');
            }
            
            return `const methods = useForm${generics || ''}({
    // @ts-ignore
    ...{},\n` + match.replace(/const\s+\{.*\}\s*=\s*useForm/, `const { ${parts.join(', ')} } = methods;\n    // hook\n    //`);
            // Actually, replacing AST with Regex for variable declaration is risky. Let's do it simpler.
        });
        
        // Let's use a simpler approach. Just match `const { ... } = useForm` and replace with `const methods = useForm` and next line `const { ... } = methods`.
        content = content.replace(/const\s+(\{[\s\S]*?\})\s*=\s*useForm(<.*?>)?\(\{([\s\S]*?)\}\);/g, (match, destructured, generics, options) => {
            let newDestructured = destructured;
            if (!newDestructured.includes('watch')) {
                newDestructured = newDestructured.replace('}', ', watch }');
            }
            return `const methods = useForm${generics || ''}({${options}});\n    const ${newDestructured} = methods;`;
        });
    }

    // 3. Inject useFormDraft hook call inside the component
    if (!content.includes('useFormDraft(')) {
        // Find a good place, e.g. after const { ... } = methods;
        const formId = path.basename(file, '.tsx').toLowerCase();
        content = content.replace(/(const \{[\s\S]*?\} = methods;)/, `$1\n    const isDataLoaded = !!user;\n    const { clearDraft } = useFormDraft('${formId}', methods, isDataLoaded);`);
    }

    // 4. In onSubmit, add clearDraft() after api.post/put
    if (content.includes('clearDraft') && !content.includes('clearDraft()')) {
        content = content.replace(/(await api\.(post|put)\(.*?\);)/g, "$1\n            clearDraft();");
    }

    // 5. Remove sticky top button
    content = content.replace(/<button[^>]*className="[^"]*btn-submit-top[^"]*"[^>]*>[\s\S]*?<\/button>/g, '');

    // 6. Add bottom button before closing </form>
    if (!content.includes('btn-app-primary')) {
        const bottomBtn = `
                <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                    <button type="submit" className="btn-app-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '12px' }} disabled={loading}>
                        <i className="fa fa-check" style={{ marginLeft: '8px' }}></i> {loading ? 'در حال ثبت...' : 'ثبت اطلاعات'}
                    </button>
                </div>
`;
        content = content.replace(/<\/form>/, bottomBtn + "            </form>");
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Processed ${file}`);
}
