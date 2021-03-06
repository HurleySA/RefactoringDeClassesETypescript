import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import api from "../../services/api";
import { FoodsContainer } from "./styles";

interface food {
  id: number,
  available: boolean,
  image: string,
  name: string,
  price: string,
  description: string,
}


export default function NewDashboard(){
    const [foods, setFoods] = useState<food[]>([]);
    const [editingFood, setEditingFood] = useState({} as food);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
      const getData = async () => {
        const response = await api.get('/foods');
        setFoods(response.data);
      }
      getData();
      

    }, [])

    const handleAddFood = async (food:food) => {
        try {
            const response = await api.post('/foods', {
              ...food,
              available: true,
            });
      
            setFoods([...foods, response.data])
            console.log(foods)
          } catch (err) {
            console.log(err);
          }
    }

    const handleUpdateFood = async (food:food) => {
        try {
            
            const foodUpdated = await api.put(
              `/foods/${editingFood.id}`,
              { ...editingFood, ...food },
            );
      
            const foodsUpdated : food[] = foods.map(f =>
              f.id !== foodUpdated.data.id ? f : foodUpdated.data,
            );

            setFoods(foodsUpdated)
          } catch (err) {
            console.log(err);
          }
    }

    const handleDeleteFood = async (id:number) => {
        await api.delete(`/foods/${id}`);

        const foodsFiltered = foods.filter(food => food.id !== id);

        setFoods(foodsFiltered);
    } 

    const toggleModal = () => {
        setModalOpen((modalOpen) => !modalOpen)
    }
    const toggleEditModal = () => {
        setEditModalOpen((editModalOpen) => !editModalOpen)
    }
    const handleEditFood = (food:food) => {
        setEditingFood(food);
        setEditModalOpen(true);
    }


    return (
        <>
          <Header openModal={toggleModal} />
       
          <ModalAddFood
            isOpen={modalOpen}
            setIsOpen={toggleModal}
            handleAddFood={handleAddFood}
          />
          <ModalEditFood
            isOpen={editModalOpen}
            setIsOpen={toggleEditModal}
            editingFood={editingFood}
            handleUpdateFood={handleUpdateFood}
          />
  
          <FoodsContainer data-testid="foods-list">
            {foods &&
              foods.map(food => (
                <Food
                  key={food.id}
                  food={food}
                  handleDelete={handleDeleteFood}
                  handleEditFood={handleEditFood}
                />
              ))}
          </FoodsContainer>
        </>
      );
    
}

