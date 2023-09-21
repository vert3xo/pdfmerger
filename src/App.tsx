import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { open, save, message } from "@tauri-apps/api/dialog";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { listen } from "@tauri-apps/api/event";
import { relaunch } from "@tauri-apps/api/process";
import ButtonBlue from "./components/ButtonBlue";
import ButtonRed from "./components/ButtonRed";
import logo from "./assets/logo.png";

function App() {
  const [files, setFiles] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);

  const update = async (_: any) => {
    try {
      const {shouldUpdate, manifest} = await checkUpdate()

      if (shouldUpdate) {
        console.log(manifest)

        await installUpdate();
        await relaunch();
      }
    } catch (e) {
      console.log(e)
    }
  }

  listen("check-update", update)

  const mergeFiles = async () => {
    setLoading(true)
    const output = await save({
      filters: [{
        name: "PDF",
        extensions: ["pdf"]
      }]
    })

    if (!output) {
      setLoading(false)
      return
    }

    try {
      await invoke("merge", {files, output})
      await message("Files merged", {title: "Success", type: "info"})
    } catch (e) {
      await message("An error occurred: " + e, {title: "Error", type: "error"})
    }
    setLoading(false)
  }

  const selectFiles = async () => {
    const selected = await open({
      multiple: true,
      filters: [{
        name: "PDF",
        extensions: ["pdf"]
      }]
    })

    if (selected) {
      if (Array.isArray(selected)) setFiles([...files, ...selected])
      if (typeof selected == "string") files.push(selected)
    }
  }

  const swapFiles = (i1: number, i2: number) => {
    setFiles(swapElementsByIndex(files, i1, i2))
  }

  return (
    <div className="flex flex-col items-center">
      <img src={logo} alt="PDF Merger" />
      <div className="flex flex-row mb-5">
        <ButtonBlue onClick={selectFiles} body="Select files" className="mr-5 w-48" />
        <ButtonRed onClick={() => setFiles([])} body="Clear files" className="w-48" />
      </div>
      {files.length == 0 ? (<h1>No files selected</h1>) : (
        <>
          <p>Selected files: {files.length}</p>
          <div className="max-w-lg w-full">
            {files.map((file, i) => {
              return (
                <div key={i} className="flex items-center border-solid border-2 border-indigo-600 rounded mb-4 pl-4">
                  <div className="flex flex-col mr-4">
                    <button onClick={() => swapFiles(i, i-1)}><i className="fa-solid fa-arrow-up"></i></button>
                    <button onClick={() => swapFiles(i, i+1)}><i className="fa-solid fa-arrow-down"></i></button>
                  </div>
                  <p onClick={() => {
                    setFiles(files.filter((_, target) => target != i))
                  }} className="hover:line-through cursor-pointer hover:text-red-700 truncate">{getNameFromPath(file)}</p>
                </div>
                )
            })}
          </div>
          <div className="mb-5">
            {isLoading ? (
              <ButtonBlue disabled={true} className="w-96" body={<i className="animate-spin fa-solid fa-gear"></i>} />
            ) : (
              <ButtonBlue onClick={mergeFiles} disabled={files.length < 2} body={files.length < 2 ? "Select at least 2 files to merge" : "Merge PDFs"} className="w-96" />
            )}
          </div>
        </>
      )}
    </div>
  );
}

const getNameFromPath = (path: string) => {
  const pathSplit = path.split('/')
  return pathSplit[pathSplit.length - 1]
}

const swapElementsByIndex = (arr: any[], i1: number, i2: number): any[] => {
  const newArr = [...arr]
  const tmp = newArr[i1]
  newArr[i1] = newArr[i2]
  newArr[i2] = tmp

  return newArr
}

export default App;
