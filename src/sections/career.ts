import type { Content } from "../content";
import { h, Raw } from "../html";
import { btn, label, sectionHead } from "../primitives";

export function career(c: Content): Raw {
  const L = c.labels;
  const k = c.career;
  const resume = k.resumeFile ? btn(k.resume, { href: `/${k.resumeFile}`, primary: true, icon: "down", download: true }) : "";
  return h`<section class="section" id="career" aria-labelledby="career-title">
  ${sectionHead(k.num, k.title, `${L.sheet} 05 · 1 ${L.of} 1`, "career-title")}
  <div class="career-grid">
    <ol class="timeline">
      ${k.jobs.map((j, i) => h`<li class="job">
        <div class="job-dates mono">${j.dates}</div>
        <div class="job-spine" aria-hidden="true"><span class="job-marker${i === 0 ? " job-marker-now" : ""}"></span></div>
        <div class="job-body">
          <h3 class="job-title"><span class="job-company">${j.company}</span> <span class="job-role">· ${j.role}</span></h3>
          <p class="job-desc">${j.desc}</p>
        </div>
      </li>`)}
    </ol>
    <div class="side-sheets">
      <div class="sheet side-sheet">
        ${label(k.certsLabel)}
        <ul class="certs">${k.certs.map(x => h`<li class="cert"><div class="cert-name">${x.name}</div><div class="cert-id mono"><bdi dir="ltr">${x.id}</bdi></div></li>`)}</ul>
        <div class="cert-verify mono">${k.verifyLine}<br><a href="https://trailhead.salesforce.com/credentials/verification" rel="noopener" target="_blank"><bdi dir="ltr">trailhead.salesforce.com/<wbr>credentials/<wbr>verification</bdi></a></div>
      </div>
      <div class="sheet side-sheet">
        ${label(k.eduLabel)}
        <div class="edu-degree">${k.degree}</div>
        <div class="edu-school">${k.school}</div>
      </div>
      ${resume ? h`<div class="side-actions">${resume}</div>` : ""}
    </div>
  </div>
</section>`;
}
