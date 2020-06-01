import React, { useState, FormEvent } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

type Car = {
  id: number;
  make: string;
  model: string;
  productionYear: number;
};

const GET_CARS = gql`
  query {
    cars {
      id
      productionYear
      make
      model
    }
  }
`;

const CREATE_CAR = gql`
  mutation createCar($input: CarInput!) {
    createCar(input: $input)
  }
`;

const UPDATE_CAR = gql`
  mutation updateCar($input: CarUpdateInput!, $id: Int!) {
    updateCar(input: $input, id: $id)
  }
`;

const DELETE_CAR = gql`
  mutation deleteCar($id: Int!) {
    deleteCar(id: $id)
  }
`;

export const Cars: React.FC = () => {
  const { data, refetch } = useQuery(GET_CARS);
  const [createCar] = useMutation(CREATE_CAR);
  const [deleteCar] = useMutation(DELETE_CAR);
  const [updateCar] = useMutation(UPDATE_CAR);

  const [id, setId] = useState(0);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [productionYear, setProductionYear] = useState(2000);

  async function handleDelete(id: number) {
    await deleteCar({ variables: { id } });
    refetch();
  }

  function handleUpdate({ id, make, model, productionYear }: Car) {
    setId(id);
    setMake(make);
    setModel(model);
    setProductionYear(productionYear);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (id) {
        await updateCar({ variables: { id: id, input: { make, model, productionYear } } });
      } else {
        await createCar({ variables: { input: { make, model, productionYear } } });
      }
    } catch (err) {
      console.log(err);
    }
    setId(0);
    setMake("");
    setModel("");
    setProductionYear(2000);
    refetch();
  }

  return (
    <div>
      <p>Cars:</p>
      {data && data.cars
        ? data.cars.map((car: Car) => (
            <p key={car.id}>
              ID: {car.id}, make: {car.make}, model: {car.model}, year of production:{" "}
              {car.productionYear} <button onClick={() => handleDelete(car.id)}>delete</button>{" "}
              <button onClick={() => handleUpdate(car)}>update</button>
            </p>
          ))
        : null}
      <form onSubmit={(e) => handleSubmit(e)}>
        Make:
        <input
          value={make}
          placeholder="make"
          onChange={(e) => {
            setMake(e.target.value);
          }}
        />
        Model:
        <input
          value={model}
          placeholder="model"
          onChange={(e) => {
            setModel(e.target.value);
          }}
        />
        Year of production:
        <input
          value={productionYear}
          placeholder="year of prod"
          onChange={(e) => {
            setProductionYear(parseInt(e.target.value));
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
