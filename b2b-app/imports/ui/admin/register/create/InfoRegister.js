import React from 'react';
import { AutoForm } from 'uniforms-material';
import { bridge as schema } from '../GuestSchema';
import { useState } from 'react';



export default function InformationHandler({submit}){
  const [data, changeData] = useState("");
 
  return <AutoForm schema = {schema} onSubmit = {model =>submit([model.firstName, model.lastName, model.workExperience])} />;
  
 
}