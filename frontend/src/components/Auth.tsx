import type { SignupInput } from "@kunal245/medium-common";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({type}: {type: "signup" | "signin"}) => {

    
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        username: "",
        password: "",
        name: "",
    });

    async function sendRequest() {
      try{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs)
        const jwt = "Bearer " + response.data;
        localStorage.setItem("token", jwt)
        navigate("/blogs")
      } catch(e){
        alert("Error while signing up")
      }
    }

    return (
      <div className="bg-taupe-600 lg:bg-taupe-600 h-screen w-screen flex justify-center items-center">
        <div className="bg-taupe-400 w-screen h-screen lg:bg-taupe-400 lg:w-[700px] lg:h-[450px] rounded-4xl shadow-2xl pt-10">
          <h1 className="font-mono text-4xl font-semibold text-taupe-900 text-center">
            Create Account
          </h1>
          <h2 className="text-xs font-medium text-center text-taupe-700" >
            {type === "signin" ? "Don't have an account" : "Have an account"}
                <Link to={type === "signin" ? "/signup" : "/signin"} className="font-semibold pl-1 underline" >
                    {type === "signin" ? "Sign up" : "Sign in"}
                </Link>
          </h2>
          <div className="py-4">
            {type === "signup" ? <LabelledInput label="Name" placeholder="Kunal Nimje" onChange={(e) => {
              setPostInputs(() => ({
                  ...postInputs,
                  name: e.target.value
                }))
            }} /> : null}
            <LabelledInput label="Username" placeholder="kunal@gmail.com" onChange={(e) => {
              setPostInputs(() => ({
                  ...postInputs,
                  username: e.target.value
              }))
            }} />
            <LabelledInput label="Password" type={"password"} placeholder="6-digit password" onChange={(e) => {
              setPostInputs(() => ({
                  ...postInputs,
                  password: e.target.value
              }))
            }} />
            <div className="py-4 flex justify-center">
                <button onClick={sendRequest} type="button" className="text-fg-brand bg-neutral-primary border border-brand hover:bg-brand hover:text-white focus:ring-4 focus:ring-brand-subtle font-medium rounded-base text-base px-6 py-3.5 focus:outline-none">{type === "signup" ? "Sign up" : "Sign in"}</button>
            </div>
          </div>
        </div>
      </div>
    );
};

interface LabelledInputType{
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: string
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div className="px-9 py-2">
        <label className=" px-2 block mb-0.2 text-sm font-semibold text-heading">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className=" bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder={placeholder} required />
    </div>
}