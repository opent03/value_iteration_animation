window.onload = () => {
    fetch('index.gd')
        .then(res => res.text())
        .then(content => gabify(document.getElementById("text-container"), content));
}

createCustomElement("thm-env", "<b>Theorem. </b><i>",  "</i>");
createCustomElement("def-env", "<b>Definition. </b>", "");