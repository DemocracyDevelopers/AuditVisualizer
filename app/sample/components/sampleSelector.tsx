import React from "react";
import Image from "next/image";

type SampleFile = {
  name: string;
  description: string;
  imageUrl: string;
  fileUrl: string;
};

const sampleFiles: SampleFile[] = [
  {
    name: "NEB Assertion",
    description: "NEB assertions example",
    imageUrl: "/sample-images/img.png",
    fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_NEB_assertions.json",
  },
  {
    name: "One candidate dominates example",
    description: "One candidate dominates example",
    imageUrl: "/sample-images/img.png",
    fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_one_candidate_dominates.json",
  },
  {
    name: "Two leading candidates example",
    description: "Two leading candidates example ",
    imageUrl: "/sample-images/img.png",
    fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_two_leading_candidates.json",
  },
];

const SampleSelector = () => {
  const handleSampleClick = (fileUrl: string) => {
    // Logic to handle sample file selection
    console.log("Selected sample:", fileUrl);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Choose a sample file</h2>
      <p className="text-sm text-gray-500 mb-6">
        Click on the example assertion name
      </p>

      {/* Image section with sample examples */}
      <div className="border-2 border-gray-300 p-8 rounded-lg grid grid-cols-3 gap-8">
        {sampleFiles.map((sample) => (
          <div
            key={sample.name}
            className="cursor-pointer text-center"
            onClick={() => handleSampleClick(sample.fileUrl)}
          >
            {/* Display name first */}
            <h3 className="text-lg mb-2 text-center">{sample.name}</h3>

            {/* Display image below the name */}
            <div className="flex justify-center">
              <Image
                src={sample.imageUrl}
                alt={sample.name}
                width={200}
                height={120}
                className="rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleSelector;
