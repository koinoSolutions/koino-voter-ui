import React, { useState } from "react";
import { Edit } from "@mui/icons-material";

import FormGenerator from "../../contants/libraries/FormGenerator/FormGenerator";
import { FIELDS } from "../../contants/libraries/FormGenerator/FormGeneratorFields";
import { replaceSpaceWithUnderscore } from "../../contants/libraries/easy";
import { useCreateElectionServices } from "../../pages/create-election/context/create-election-context";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useImageLibrary } from "../../components/image-library/image-library-hook";
import { useEffect } from "react";

export default function AddContestantForm({ data, editing, resetErrors }) {
  const { selectedImage, setShowLibrary } = useImageLibrary();

  const [imageError, setImageError] = useState({
    state: false,
    message: false,
  });
  const [tempImage, setTempImage] = useState({
    ImageUrl: "",
    ImageInfo: undefined,
  });
  const [editMode, setEditMode] = useState(editing);

  const { addContestant, bluePrintState } = useCreateElectionServices();

  const info = bluePrintState?.ContestantDefinition;
  //   console.log("===print", contestantPrint.Info);

  // Create fields for form
  const fields = [
    {
      fieldType: FIELDS.input,
      name: "Ballot_Number",
      label: "Ballot number",
      placeholder: "Ballot number",
      required: true,
      defaultValue: data?.BallotNumber,
    },
  ];

  Array.isArray(info) &&
    info?.map((item) => {
      if (
        item.Title === "ImageInfo" ||
        item.Title === "Image" ||
        item.Title === "ImageUrl" ||
        item.Title === "Ballot_Number"
      )
        return null;
      fields.push({
        fieldType: FIELDS.input,
        name: replaceSpaceWithUnderscore(item.Title),
        label: item.Title,
        placeholder: item.Title,
        required: true,
        defaultValue: "",
      });
      return null;
    });
  const handleFormSubmit = (formData, resetFunc) => {
    if (tempImage.ImageInfo === undefined) {
      setImageError({ state: true, message: "Image is required" });
      return;
    }
    let newContestdantData = {
      Info: {
        ...formData,
        ImageUrl: tempImage.ImageUrl,
        ImageInfo: tempImage.ImageInfo,
      },
      Position: data?.position,
      PositionId: data?.positionId,
      VotesCount: null,
      Votes: [],
    };
    addContestant(newContestdantData);
    resetFunc();
    setTempImage({ ImageInfo: undefined, ImageUrl: "" });
    console.log("edited", newContestdantData);
  };
  useEffect(() => {
    setTempImage({
      ImageUrl: selectedImage?.url,
      ImageInfo: selectedImage?.url,
    });
  }, [selectedImage]);

  const closeForm = () => {
    setTempImage({ ImageUrl: "", ImageInfo: undefined });
    setEditMode(false);
    setShowLibrary(false);
  };

  return (
    <>
      {editMode && (
        <div
          onClick={() => closeForm()}
          className="w-full h-full  fixed z-[5] left-0 top-0 bg-backdrop2"
        ></div>
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`${
          editMode &&
          "fixed left-0 pointer-events-none top-20 w-full h-full flex justify-center items-center z-[30]  "
        }`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            resetErrors();
            setEditMode(true);
          }}
          // style={{ transition: "all 0.2s linear" }}
          className={`${
            editMode
              ? "absolute z-[6] animate-zoomIn top-0 bg-white h-auto "
              : "w-[200px min-h-[200px] mb-[20px] bg-yellow-100 "
          }
           w-[200px] pointer-events-auto  hover:shadow-2xl rounded-2xl  shadow  px-2 cursor-pointer flex items-center flex-col relative`}
        >
          {/* <img className="h-[60px] w-[60px]" alt="" src={tempImage.ImageUrl} /> */}
          {editMode ? (
            <div
              style={{ backgroundImage: `url(${tempImage.ImageUrl})` }}
              className="w-[100px] mt-3 h-[100px] min-h-[100px] relative min-w-[100px] bg-gray-100 rounded-full fit-bg mb-2"
            >
              <div
                onClick={() => {
                  setShowLibrary(true);
                  // imageInput?.current?.click();
                }}
                className="absolute animate-rise bottom-2 bg-backdrop hover:bg-backdrop2 p-1 text-white rounded-lg right-0"
              >
                <Edit />
              </div>
              {imageError.state && (
                <span
                  style={{ fontSize: 11 }}
                  className="absolute bottom-[-20px] flex justify-center w-full text-red-400"
                >
                  {imageError.message}
                </span>
              )}
            </div>
          ) : (
            <div className="w-[200px] h-[200px] text-yellow-800  flex justify-center items-center flex-col cursor-pointer ">
              <PlusCircleIcon className="h-[30%] w-[30%]" />
              <span className="w-full flex justify-center mb-2">
                Add contestant
              </span>
            </div>
          )}
          {/* Extra info fields -> show if editMode is on */}
          {editMode && (
            <div className="w-full h-full flex flex-col items-center px-4">
              <FormGenerator
                fields={fields}
                handleOnSubmit={(data, resetFunc, completed) => {
                  handleFormSubmit(data, resetFunc, completed);
                }}
                buttonStyles={{
                  backgroundColor: "#5E71E4",
                  borderRadius: "5px",
                  backgroundColor: "black",
                }}
                buttonText="Create"
                // serverReport={this.props.authError}
                // reportState={this.props.errorState}
              />
            </div>
          )}

          {/* Delete and Edit buttons -> show if not in edit mode */}
          <div className="w-[200px] h-[50px] items-center flex justify-center absolute bottom-[-50px] "></div>
        </div>
      </div>
    </>
  );
}
