document.addEventListener("DOMContentLoaded", function() {
    JsBarcode("#barcode", "ABC123456789", {
        format: "CODE128", 
        width: 2.05,
        height: 70,
        displayValue: false 
    });
});