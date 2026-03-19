const soap = require("soap");

soap.createClient("http://localhost:8000/products?wsdl", {}, function (err, client) {
  if (err) {
    console.error("Error creating SOAP client:", err);
    return;
  }

  // Make a SOAP request with all parameters
  client.CreateProduct({ name: "My product", about: "This is a great product", price: 19.99 }, function (err, result) {
    if (err) {
      console.error(
        "Error making SOAP request:",
        err.response.status,
        err.response.statusText,
        err.body
      );
      return;
    }
    console.log("Create Product result:", result);
  });

  client.GetProducts({}, function (err, result) {
    if (err) {
      console.error(
        "Error making SOAP request:",
        err.response.status,
        err.response.statusText,
        err.body
      );
      return;
    }
    console.log("Get Products result:", result);
  });

  client.PatchProduct({ id: 3, name: "Updated product name", about: "Updated product description", price: 29.99 }, function (err, result) {
    if (err) {
      console.error(
        "Error making SOAP request:",
        err.response.status,
        err.response.statusText,
        err.body
      );
      return;
    }
    console.log("Patch Product result:", result);
  });
});
