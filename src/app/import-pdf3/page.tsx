"use client";

import React, { ChangeEvent, useState } from "react";

import * as pdfjs from "pdfjs-dist";

const ExtractSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [extractedSection, setExtractedSection] = useState<string[]>([]);
  const [extractedSection1, setExtractedSection1] = useState<string[]>([]);
  const [extractedSection2, setExtractedSection2] = useState<string[]>([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const arrayBuffer = await readFileAsArrayBuffer(file);

      if (arrayBuffer) {
        try {
          // Carrega o documento PDF
          const pdfDoc = await pdfjs.getDocument(arrayBuffer).promise;

          const sectionTitle1 = "Experience";
          const sectionTitle2 = "Education";
          // const sectionTitle = "Experience";

          const pages = pdfDoc.numPages;
          const extractedSection1: string[] = [];
          const extractedSection2: string[] = [];
          let currentSection = "";

          for (let pageNum = 1; pageNum <= pages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const content = await page.getTextContent();

            for (let i = 0; i < content.items.length; i++) {
              const item = content.items[i];

              if ("str" in item) {
                if (item.str.includes(sectionTitle1)) {
                  // Início da seção "Experience"
                  currentSection = sectionTitle1;
                  extractedSection1.push(item.str);
                } else if (item.str.includes(sectionTitle2)) {
                  // Início da seção "Education"
                  currentSection = sectionTitle2;
                  extractedSection2.push(item.str);
                } else if (currentSection) {
                  if (currentSection === "Experience") {
                    extractedSection1.push(item.str);
                  }
                  if (currentSection === "Education") {
                    extractedSection2.push(item.str);
                  }
                  // Adiciona o conteúdo à seção atual
                }
              }
            }
          }

          console.log("extractedSection1: ", extractedSection1);
          console.log("extractedSection2: ", extractedSection2);
          // let extractedSection: string[] = [];

          // Itera pelas páginas do PDF
          // for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          //   const page = await pdfDoc.getPage(pageNum);
          //   const content = await page.getTextContent();

          //   const text: string[] = content.items.map((item) => {
          //     if ("str" in item) {
          //       return item.str;
          //     }
          //     return ""; // Trate outros tipos de itens como vazios
          //   });

          //   // const text = content.items.map((item) => {
          //   //   if ("str" in item) {
          //   //     return item.str;
          //   //   }
          //   //   return ""; // Trate outros tipos de itens como vazios
          //   // });
          //   // .filter((item) => item.trim() !== "");
          //   // .join("");

          //   console.log("text: ", text);

          //   // Verifica se a seção desejada está na página
          //   if (text.includes(sectionTitle)) {
          //     extractedSection = text;
          //     break;
          //   }
          // }

          if (extractedSection1) {
            setExtractedSection1(extractedSection1);
          } else {
            setExtractedSection1(["Seção não encontrada no PDF."]);
          }

          if (extractedSection2) {
            setExtractedSection2(extractedSection2);
          } else {
            setExtractedSection2(["Seção não encontrada no PDF."]);
          }

          // TEXTO TUDO JUNTO
          // if (extractedSection) {
          //   setExtractedSection(extractedSection);
          // } else {
          //   setExtractedSection("Seção não encontrada no PDF.");
          // }
        } catch (error) {
          console.error("Erro ao processar o PDF:", error);
          setExtractedSection1([
            "Erro ao processar o PDF. Verifique se o arquivo é válido.",
          ]);

          // TEXTO TUDO JUNTO
          // setExtractedSection(
          //   "Erro ao processar o PDF. Verifique se o arquivo é válido.",
          // );
        }
      }
    }
  };

  const readFileAsArrayBuffer = (file: File) => {
    return new Promise<ArrayBuffer | null>((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && event.target.result instanceof ArrayBuffer) {
          resolve(event.target.result);
        } else {
          resolve(null);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {selectedFile && <p>Arquivo selecionado: {selectedFile.name}</p>}
      {extractedSection1.map((item, index) =>
        item ? (
          <React.Fragment key={index}>
            {index > 0 && extractedSection1[index - 1] && <br />}
            {item}
          </React.Fragment>
        ) : (
          <br key={index} />
        ),
      )}
      <br />
      <br />
      <br />
      {extractedSection2.map((item, index) =>
        item ? (
          <React.Fragment key={index}>
            {index > 0 && extractedSection2[index - 1] && <br />}
            {item}
          </React.Fragment>
        ) : (
          <br key={index} />
        ),
      )}
      {/* {extractedSection && (
        <div>
          <h2>Seção Extraída:</h2>
          <pre>{extractedSection}</pre>
        </div>
      )} */}
    </div>
  );
};

export default ExtractSection;
