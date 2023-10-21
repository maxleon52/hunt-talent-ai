"use client";

import React, { useEffect, useState } from "react";

import * as pdfjs from "pdfjs-dist";

function PdfReader() {
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  console.log("pdfjs: ", pdfjs);

  const [pdfFields, setPdfFields] = useState<{ name: string; value: string }[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);

  const handlePdfUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError(null); // Limpa erros anteriores

    const file = event.target.files?.[0];

    if (file) {
      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        console.log("arrayBuffer: ", arrayBuffer);

        // const pdfDoc = await pdfjs?.getDocument(arrayBuffer).promise;
        if (pdfjs) {
          // const pdfDoc = await pdfjs.getDocument(arrayBuffer).promise;
          const pdfDoc = await pdfjs.getDocument(arrayBuffer).promise;
          console.log("pdfDoc: ", pdfDoc);

          const fields: { name: string; value: string }[] = [];

          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            console.log(`entrei no FOR ${pageNum}`);

            const page = await pdfDoc.getPage(pageNum);
            console.log("page: ", page);
            const annotations = await page.getAnnotations();
            console.log("annotations: ", annotations);

            annotations.forEach((annotation) => {
              console.log("annotation: ", annotation);

              if (annotation.fieldValue) {
                fields.push({
                  name: annotation.fieldName,
                  value: annotation.fieldValue,
                });
              }
            });
          }

          setPdfFields(fields);
        }
      } catch (error) {
        console.error("Erro ao processar o PDF:", error);
        setError("Erro ao processar o PDF. Verifique se o arquivo é válido.");
      }
    } else {
      console.error("Selecione um arquivo PDF válido para continuar:", error);
      setError("Selecione um arquivo PDF válido para continuar.");
    }
  };

  const readFileAsArrayBuffer = (file: File) => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && event.target.result instanceof ArrayBuffer) {
          console.log("eventOnLoadResolve: ", event);
          resolve(event.target.result);
        } else {
          console.log("eventOnLoad: ", event);
          reject(new Error("Erro ao ler o arquivo como ArrayBuffer."));
        }
      };

      reader.onerror = (event) => {
        console.log("eventOnError: ", event);

        reject(
          new Error(
            "Erro ao ler o arquivo como ArrayBuffer: " + event.target?.error,
          ),
        );
      };

      reader.readAsArrayBuffer(file);
    });
  };

  useEffect(() => {
    console.log("pdfFields: ", pdfFields);
  }, [pdfFields]);

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handlePdfUpload} />
      {error && <p className="error">{error}</p>}
      <ul>
        {pdfFields.map((field, index) => (
          <li key={index}>
            Campo: {field.name}, Valor: {field.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PdfReader;
