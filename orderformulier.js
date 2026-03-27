function openSuccessModal() { document.getElementById('successModal').style.display = 'flex'; }
function closeSuccessModal() { document.getElementById('successModal').style.display = 'none'; }

// Form validation & API submit
(function () {
  const form = document.getElementById("orderForm");
  const submitBtn = document.getElementById("submitbestelling");
  const status = document.getElementById("formStatus");

  function updateSubmitState() {
    if (form.checkValidity()) {
      submitBtn.disabled = false;
      status.style.display = "none";
    } else {
      submitBtn.disabled = true;
      status.style.display = "block";
    }
  }

  const inputs = form.querySelectorAll("input[required], textarea[required]");
  inputs.forEach(el => {
    el.addEventListener("input", updateSubmitState);
    el.addEventListener("change", updateSubmitState);
  });

  updateSubmitState();

  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = "Controleer de verplichte velden en probeer opnieuw.";
      status.style.display = "block";
      return;
    }

    const formData = new FormData();
    formData.append("naam", document.getElementById("naam_form").value);
    formData.append("email", document.getElementById("email_form").value);
    formData.append("tel", document.getElementById("telefoon_form").value);
    formData.append("afhaaldatum", document.getElementById("afhaaldatum_form").value);
    formData.append("afhaaltijd", document.getElementById("afhaaltijd_uur").value);
    formData.append("bestelling", document.getElementById("bestelling_form").value);
    formData.append("opmerkingen", document.getElementById("opmerkingen_form").value);

    submitBtn.disabled = true;

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbz5fhGZrF824qgTpof0A9F5ntMpDWJIqL1mbJltgEdPtiPympDY5Lqcy6H3f5xS0DJ0/exec",
        {
          method: "POST",
          body: formData
        }
      );

      const json = await res.json();

      if (json.status !== "ok") {
        throw new Error(json.message || "Onbekende fout");
      }

      openSuccessModal()
      form.reset();
      updateSubmitState();

    } catch (err) {
      console.error(err);
      alert("Fout bij verzenden");
      submitBtn.disabled = false;
    }
  });
})();

// JQUERY DATUMKIEZER LOGICA
$(document).ready(function() {
    
    function disableWeekdays(date) {
        var day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        var today = new Date();
        
        // Datum in het verleden
        if (date < today) {
            return [false]; 
        }

        // Alleen Vrijdag (5), Zaterdag (6) en Zondag (0) toestaan
        if (day >= 1 && day <= 4) {
            return [false]; // Niet selecteerbaar (Maandag t/m Donderdag)
        }
        
        return [true]; // Selecteerbaar (Vrijdag, Zaterdag, Zondag)
    }

    $('#afhaaldatum_form').datepicker({
        // Formaat: Vrijdag, 26 november 2025
        dateFormat: 'DD, d MM, yy',
        beforeShowDay: disableWeekdays,
        minDate: 0 // Zorgt ervoor dat je geen dagen in het verleden kunt selecteren
    });
    
    // Zet de Datepicker op Nederlandse taal
    $.datepicker.setDefaults($.datepicker.regional['nl'] = {
        closeText: 'Sluiten',
        prevText: '←',
        nextText: '→',
        currentText: 'Vandaag',
        monthNames: ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
        monthNamesShort: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
        'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
        dayNames: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
        dayNamesShort: ['zon', 'maa', 'din', 'woe', 'don', 'vrij', 'zat'],
        dayNamesMin: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
        weekHeader: 'Wk',
        dateFormat: 'dd-mm-yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    });
    $.datepicker.setDefaults($.datepicker.regional['nl']);
});
