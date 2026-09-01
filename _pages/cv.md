---
layout: page
permalink: /cv/
title: cv
nav: true
nav_order: 6
description: My full professional curriculum vitae is available as a PDF.
---

{% assign cv_pdf_url = '/assets/pdf/Thang_Pham_CV.pdf' | relative_url %}

<p>
  <a href="{{ cv_pdf_url }}" target="_blank" rel="noopener noreferrer">Open my full professional CV in a new tab (PDF)</a>.
</p>

<object
  class="cv-pdf-viewer"
  data="{{ cv_pdf_url }}"
  type="application/pdf"
  width="100%"
  title="Thang Pham curriculum vitae PDF"
  aria-label="Thang Pham curriculum vitae PDF"
  style="height: 80vh; min-height: 600px"
>
  <p>
    Your browser cannot display embedded PDFs.
    <a href="{{ cv_pdf_url }}" target="_blank" rel="noopener noreferrer">Open the CV PDF in a new tab</a>.
  </p>
</object>
