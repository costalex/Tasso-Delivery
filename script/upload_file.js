var fileInput_identity_card = document.querySelector('#identity_card');
var fileInput_file2 = document.querySelector('#file2');

fileInput_identity_card.addEventListener('change', function() {

    var xhr = new XMLHttpRequest();

    // Upload du fichier…
    var form = new FormData();
    form.append('file', fileInput_identity_card.files[0]);
});

fileInput_file2.addEventListener('change', function() {

    var xhr = new XMLHttpRequest();

    // Upload du fichier…
    var form = new FormData();
    form.append('file', fileInput_file2.files[0]);
});
