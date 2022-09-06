const getDataBaseEmplooye = async () => {
    let empleadosCargados = JSON.parse(window.localStorage.getItem("empleados"));
    if (!empleadosCargados) {
      const response = await fetch(
        "https://run.mocky.io/v3/aa2ae83d-e14b-4af3-9283-982a7575ad1d",
        {
          // mode: 'no-cors',
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      responseData = await response.json();
      empleadosCargados = JSON.parse(JSON.stringify(responseData.data));
      localStorage.setItem("empleados", JSON.stringify(responseData.data));
    }
  
    $(document).ready(function () {
      if (!empleadosCargados || empleadosCargados === null) {
        $(".empleados").append(
          `<h1 style="text-align:center;">No hay empleados cargados actualmente ...</h1>`
        );
      } else {
        mostrarEmpleados(empleadosCargados);
      }
    });
  };
  getDataBaseEmplooye();
  function limpiarRow() {
    $(".empleados").empty();
  }
  function mostrarEmpleados(empleados) {
    limpiarRow();
    const empleadosRow = $(".empleados");
    empleados.forEach((element) => {
      empleadosRow.append(`<div class="col-sm-3"  style="margin-bottom: 20px;">
  
  
          <div class="card" style="width: 15rem;">
              <img src="../img/${element.sexo}.png" class="card-img-top" alt="..." >
              <div class="card-body">
                <h5 class="card-title" id="nombre">${element.nombre}</h5>
                <input type="hidden" name="id" value="${element.id}">
                <p class="card-text" id="dni">DNI: ${element.dni} </p>
                 <p> Labor: <span id="labor" id="labor">${element.labor}</span> </p>
                 <p> Sueldo: <span id="saldo" style="color:green;font-weight: bold;">$${element.sueldo}</span> </p>
  
               
                <a href="#" class="btn btn-danger" onclick="eliminarEmpleado(${element.id})"><i class="fa-solid fa-trash-can"></i> Eliminar </a>
  
              </div>
            </div>
  
      </div>`);
    });
  }
  
  function editarEmpleado(id) {
    const empleado = buscarEmpleado(id);
    $("#nombreEdit").val(empleado.nombre);
    $("#sueldoEdit").val(empleado.sueldo);
    $("#laborEdit").val(empleado.labor);
    $("#dniEdit").val(empleado.dni);
    $("#sexoEdit").val(empleado.sexo);
  }
  
  function resetApp() {
    Swal.fire({
      title: "Esta seguro que desea resetear la aplicación?",
  
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Reseteado", "La aplicacion ha sido reseteada", "success");
        localStorage.clear();
  
        limpiarRow();
  
        if (window.localStorage.getItem("empleados") === null) {
          $(".empleados").append(
            `<h1 style="text-align:center;">No hay empleados cargados actualmente ...</h1>`
          );
        }
      }
    });
  }
  
  function eliminarEmpleado(id) {
    console.log(id);
    Swal.fire({
      title: "Esta seguro que desea eliminar este empleado?",
  
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
    }).then((result) => {
      if (result.isConfirmed) {
        buscarYRemover(id);
  
        Swal.fire("Eliminado!", "El empleado a sido eliminado", "success");
      }
    });
  }
  
  function buscarEmpleado(id) {
    let data = [];
    aux = getEmpleados();
    aux.forEach((element, i) => {
      if (element.id === id) {
        data = element;
        return data;
      } else {
        return null;
      }
    });
  
    return data;
  }
  
  function buscarYRemover(id) {
    aux = getEmpleados();
    aux.forEach((element, i) => {
      if (element.id === id) {
        aux.splice(i, 1);
      }
    });
  
    localStorage.setItem("empleados", JSON.stringify(aux));
    mostrarEmpleados(aux);
  
    // console.log(aux)
    // console.log(getEmpleados())
  }
  
  function getEmpleados() {
    return JSON.parse(window.localStorage.getItem("empleados"));
  }
  
  $("#addEmpleado").on("submit", function (e) {
    e.preventDefault();
  
    const nombreApellido = $("#nombreAdd").val();
    const sueldo = $("#sueldoAdd").val();
    const labor = $("#laborAdd").val();
    const dni = $("#dniAdd").val();
    const sexo = document.querySelector(
      'input[name="flexRadioDefault"]:checked'
    ).value;
  
    const data = {
      nombre: nombreApellido,
      sueldo: sueldo,
      labor: labor,
      dni: dni,
      sexo: sexo,
    };
    // console.log(data)
  
    if (validar(data)) {
      guardarEmpleado(data);
      $("#exampleModal").modal("hide");
      limpiarCampos();
      Swal.fire({
        icon: "success",
        html: "<h3><b>Empleado agregado</b></h3>",
      });
  
      mostrarEmpleados(getEmpleados());
    }
  });
  
  function limpiarCampos() {
    $("#nombreAdd").val("");
    $("#sueldoAdd").val("");
    $("#laborAdd").val("");
    $("#dniAdd").val("");
    $("#sexoAdd").val("");
  }
  function validar(data) {
    let control = true;
  
    if (data.nombre == "") {
      control = false;
      $(".errorNombre").empty();
      $(".errorNombre").append(
        '<label for="">EL NOMBRE Y APELLIDO SON OBLIGATORIOS</label>'
      );
      $(".errorNombre").css("visibility", "visible");
      $(".errorNombre").css("background-color", "red");
      // alert('El nombre esta vacio');
    } else {
      $(".errorNombre").css("visibility", "hidden");
    }
  
    if (data.dni == "") {
      control = false;
  
      $(".errorDni").empty();
      $(".errorDni").append('<label for="">EL DNI ES OBLIGATORIO</label>');
      $(".errorDni").css("visibility", "visible");
      // alert('El nombre esta vacio');
    } else if (data.dni < 0) {
      control = false;
  
      $(".errorDni").empty();
      $(".errorDni").append('<label for="">EL DNI NO PUEDE SER NEGATIVO</label>');
      $(".errorDni").css("background-color", "red");
      $(".errorDni").css("visibility", "visible");
    } else {
      $(".errorDni").css("visibility", "hidden");
    }
  
    if (data.sueldo == "") {
      control = false;
  
      $(".errorSueldo").empty();
      $(".errorSueldo").append('<label for="">EL SUELDO ES OBLIGATORIO</label>');
      $(".errorSueldo").css("background-color", "red");
  
      $(".errorSueldo").css("visibility", "visible");
      // alert('El nombre esta vacio');
    } else if (data.sueldo < 0) {
      control = false;
  
      $(".errorSueldo").empty();
      $(".errorSueldo").append(
        '<label for="">EL SUELDO NO PUEDE SER NEGATIVO</label>'
      );
      $(".errorSueldo").css("background-color", "red");
      $(".errorSueldo").css("visibility", "visible");
    } else {
      $(".errorSueldo").css("visibility", "hidden");
    }
  
    return control;
  }
  
  guardarEmpleado = (data) => {
    const id = generarId();
    data.id = id;
  
    //.............................
    const empleados = window.localStorage.getItem("empleados");
  
    if (empleados === null) {
      window.localStorage.setItem("empleados", JSON.stringify([data]));
    } else {
      const actualArray = JSON.parse(empleados);
      actualArray.push(data);
  
      window.localStorage.setItem("empleados", JSON.stringify(actualArray));
    }
    mostrarEmpleados(JSON.parse(window.localStorage.getItem("empleados")));
  };
  
  generarId = () => {
    let id = Math.floor(Math.random() * 100) * Date.now();
    return id;
  };
  
  $("#editar").click(function (e) {
    var id = $(this).attr("nombre");
    alert(id);
  });