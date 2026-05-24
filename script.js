async function fileToBase64(file){

  return new Promise((resolve,reject)=>{

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = error => reject(error);

  });
}

async function createImageHTML(files){

  if(files.length === 0) return "";

  let imagesHTML =
    `<div class="photo-grid">`;

  for(let i=0;i<files.length;i++){

    const base64 =
      await fileToBase64(files[i]);

    imagesHTML += `
      <img src="${base64}">
    `;
  }

  imagesHTML += `</div>`;

  return imagesHTML;
}

function createRow(label,value){

  if(!value) return "";

  return `
    <tr>
      <td class="table-label">
        ${label}
      </td>

      <td>
        ${value}
      </td>
    </tr>
  `;
}

async function generateReport(){

  const indusId =
    document.getElementById("indusId").value;

  const siteName =
    document.getElementById("siteName").value;

  const district =
    document.getElementById("district").value;

  if(!indusId || !siteName || !district){

    alert("Please fill all required (*) fields");

    return;
  }

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

  const ongoingFiles =
    document.getElementById("ongoingPhotos").files;

  const afterFiles =
    document.getElementById("afterPhotos").files;

  const beforeHTML =
    await createImageHTML(beforeFiles);

  const ongoingHTML =
    await createImageHTML(ongoingFiles);

  const afterHTML =
    await createImageHTML(afterFiles);

  document.getElementById("reportOutput").innerHTML = `

    <div
      class="report-box"
      id="pdfContent"
    >

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

      <table class="report-table">

        ${createRow("INDUS ID",indusId)}

        ${createRow("Site Name",siteName)}

        ${createRow("District",district)}

        ${createRow("Engineer Name",engineerName)}

        ${createRow("Date",date)}

        ${createRow("Work Type",workType)}

      </table>

      ${description ? `

      <div class="description-box">

        <strong>
          Work Description:
        </strong>

        <br><br>

        ${description}

      </div>

      ` : ""}

      ${beforeHTML ? `

      <div class="photo-section">

        <div class="photo-title">
          Before Photos
        </div>

        ${beforeHTML}

      </div>

      ` : ""}

      ${ongoingHTML ? `

      <div class="photo-section">

        <div class="photo-title">
          Ongoing Work Photos
        </div>

        ${ongoingHTML}

      </div>

      ` : ""}

      ${afterHTML ? `

      <div class="photo-section">

        <div class="photo-title">
          After Completion Photos
        </div>

        ${afterHTML}

      </div>

      ` : ""}

    </div>
  `;
}

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
      scale:3,
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