// Substitute properties from a template
function applyTemplate(obj, template) {
    let keys = Object.keys(template);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        obj[key] = template[key];
    }
}
