async function fileToBase64(file){

  return new Promise((resolve,reject)=>{

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = error => reject(error);

  });
}

/* =========================
   CREATE IMAGE HTML
========================= */

async function createImageHTML(files){

  let imagesHTML =
    `<div class="photo-grid">`;

  for(let i=0;i<files.length;i++){

    const base64 =
      await fileToBase64(files[i]);

    imagesHTML += `
      <img
        src="${base64}"
        crossorigin="anonymous"
      >
    `;
  }

  imagesHTML += `</div>`;

  return imagesHTML;
}

/* =========================
   GENERATE REPORT
========================= */

async function generateReport(){

  const indusId =
    document.getElementById("indusId").value;

  const siteName =
    document.getElementById("siteName").value;

  const district =
    document.getElementById("district").value;

  const engineerName =
    document.getElementById("engineerName").value;

  const date =
    document.getElementById("date").value;

  const workType =
    document.getElementById("workType").value;

  const description =
    document.getElementById("description").value;

  const beforeFiles =
    document.getElementById("beforePhotos").files;

  const afterFiles =
    document.getElementById("afterPhotos").files;

  const beforeHTML =
    await createImageHTML(beforeFiles);

  const afterHTML =
    await createImageHTML(afterFiles);

  document.getElementById("reportOutput").innerHTML = `

    <div
      class="report-box"
      id="pdfContent"
    >

      <!-- HEADER -->

      <div class="report-header">

        <div>

          <div class="report-title">
            Closure Report
          </div>

          <div class="report-sub">
            Cescom Engineers
          </div>

        </div>

        <div class="logo-circle">
          CE
        </div>

      </div>

      <!-- TABLE -->

      <table class="report-table">

        <tr>
          <td class="table-label">
            INDUS ID
          </td>

          <td>
            ${indusId}
          </td>
        </tr>

        <tr>
          <td class="table-label">
            Site Name
          </td>

          <td>
            ${siteName}
          </td>
        </tr>

        <tr>
          <td class="table-label">
            District
          </td>

          <td>
            ${district}
          </td>
        </tr>

        <tr>
          <td class="table-label">
            Engineer Name
          </td>

          <td>
            ${engineerName}
          </td>
        </tr>

        <tr>
          <td class="table-label">
            Date
          </td>

          <td>
            ${date}
          </td>
        </tr>

        <tr>
          <td class="table-label">
            Work Type
          </td>

          <td>
            ${workType}
          </td>
        </tr>

      </table>

      <!-- DESCRIPTION -->

      <div class="description-box">

        <strong>
          Work Description:
        </strong>

        <br><br>

        ${description}

      </div>

      <!-- BEFORE PHOTOS -->

      <div class="photo-section">

        <div class="photo-title">
          Before Photos
        </div>

        ${beforeHTML}

      </div>

      <!-- AFTER PHOTOS -->

      <div class="photo-section">

        <div class="photo-title">
          After Completion Photos
        </div>

        ${afterHTML}

      </div>

    </div>
  `;
}

/* =========================
   DOWNLOAD PDF
========================= */

function downloadPDF(){

  const element =
    document.getElementById("pdfContent");

  if(!element){

    alert("Generate report first");

    return;
  }

  const indusId =
    document.getElementById("indusId").value || "Report";

  const options = {

    margin:5,

    filename:`${indusId}.pdf`,

    image:{
      type:'jpeg',
      quality:1
    },

    html2canvas:{
      scale:2,
      useCORS:true,
      scrollY:0
    },

    jsPDF:{
      unit:'mm',
      format:'a4',
      orientation:'portrait'
    },

    pagebreak:{
      mode:['avoid-all','css','legacy']
    }
  };

  html2pdf()
    .set(options)
    .from(element)
    .save();
}