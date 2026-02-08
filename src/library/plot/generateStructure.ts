import { EventSource } from "eventsource";

export function generateStructureStream({
  existingStructure,
  description,
  framework,
  language,
}: {
  existingStructure: string;
  description: string;
  framework: string;
  language: string;
}): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let finalResult = "";

    const url = `http://localhost:3000/generate-structure-stream?existingStructure=${encodeURIComponent(
      existingStructure
    )}&description=${encodeURIComponent(
      description
    )}&framework=${encodeURIComponent(
      framework
    )}&language=${encodeURIComponent(language)}`;

    const es = new EventSource(url);

    es.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        console.log(data.message);
      }
      if (data.done) {
        finalResult = data.result;
        es.close();
        resolve(finalResult);
      }
      if (data.error) {
        es.close();
        reject(new Error(data.error));
      }
    };

    es.onerror = (err: any) => {
      es.close();
      reject(err || new Error("Unknown SSE error"));
    };
  });
}
