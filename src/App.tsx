import { List } from "./interfaces/list.interface";
import { useEffect, useState } from "react";

export default function Home() {
  const initialList: List[] = JSON.parse(
    localStorage.getItem("shoppingList") ||
      '[{"name":"Item","amount":1,"checked":false,"value":0}]',
  );

  const [list, setList] = useState<List[]>(initialList);
  const [modalDeletar, setModalDeletar] = useState(false);

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(list));
  }, [list]);

  const handleCheckboxChange = (index: number) => {
    const newList = [...list];
    newList[index].checked = !newList[index].checked;
    setList(newList);
  };

  const handleInputChange = (
    index: number,
    key: "name" | "amount" | "checked" | "value",
    newValue: string | number,
  ) => {
    const newList: List[] = list.map((item, i) =>
      i === index ? { ...item, [key]: newValue } : item,
    );
    setList(newList);
  };

  const handleRemoveItem = (index: number) => {
    const newList: List[] = list.filter((_, i) => i !== index);
    setList(newList);
  };

  const handleAddItem = () => {
    const newItem: List = {
      name: "",
      amount: 1,
      checked: false,
      value: 0,
    };
    setList([...list, newItem]);
  };

  const calculateTotal = () => {
    const total = list.reduce((acc, item) => {
      return item.checked ? acc + item.amount * item.value : acc;
    }, 0);
    return total.toFixed(2);
  };

  const handleCopyToClipboard = () => {
    const listJson = JSON.stringify(list);
    navigator.clipboard
      .writeText(listJson)
      .then(() => {
        alert("Lista copiada para a área de transferência!");
      })
      .catch((err) => {
        console.error("Erro ao copiar para a área de transferência:", err);
      });
  };

  const handlePasteFromClipboard = () => {
    navigator.clipboard
      .readText()
      .then((clipboardText) => {
        try {
          const parsedList = JSON.parse(clipboardText);
          setList(parsedList);
          alert("Lista colada da área de transferência!");
        } catch (error) {
          console.error("Erro ao colar da área de transferência:", error);
          alert("A lista na área de transferência não é válida.");
        }
      })
      .catch((err) => {
        console.error("Erro ao ler da área de transferência:", err);
        alert("Erro ao ler da área de transferência.");
      });
  };

  return (
    <main className="mt-8 flex w-full flex-1 flex-col items-center justify-center gap-2">
      <h1 className="cursor-default text-3xl font-semibold">
        Lista de Compras{" "}
        <span onClick={() => console.log(list)} className="cursor-pointer">
          🛒
        </span>
      </h1>

      <p className="flex cursor-default items-center justify-center gap-2">
        Total: R${calculateTotal()}{" "}
        <span className="text-xs text-slate-400">
          &#40;só itens marcados são somados&#41;
        </span>
      </p>

      <ul className="flex flex-col items-center justify-center gap-2">
        <li className="flex cursor-default items-end justify-end gap-4 text-slate-400">
          <span className="pl-14 pr-24">Título</span>
          <span>Quant.</span>
          <span>Preço</span>
        </li>
        {list.map((item, index) => (
          <li key={index} className="flex h-8 flex-col">
            <div className="flex flex-row items-center justify-center gap-2">
              <span>{index + 1}.&nbsp;</span>
              <input
                className="checkbox-input"
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckboxChange(index)}
              />
              <input
                className="border-b border-slate-600 bg-black px-2 py-1"
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
              />
              <input
                className="w-10 border-b border-slate-600 bg-black px-2 py-1"
                type="number"
                value={item.amount}
                onChange={(e) =>
                  handleInputChange(
                    index,
                    "amount",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
              <input
                className="w-16 border-b border-slate-600 bg-black px-2 py-1"
                type="number"
                value={item.value}
                onChange={(e) =>
                  handleInputChange(
                    index,
                    "value",
                    e.target.value.replace(",", "."),
                  )
                }
              />
              <button onClick={() => handleRemoveItem(index)}>❌</button>
            </div>
            {item.checked && (
              <div className="pointer-events-none w-[93%] -translate-y-4 border-t"></div>
            )}
          </li>
        ))}
      </ul>
      <button
        className="mt-4 rounded-md bg-green-600 px-4 py-2"
        onClick={handleAddItem}
      >
        Adicionar Novo Item
      </button>
      <div className="my-20 flex flex-col gap-2">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={handleCopyToClipboard}
        >
          Copiar lista para área de transferência
        </button>
        <button
          className="rounded-md bg-green-500 px-4 py-2 text-white"
          onClick={handlePasteFromClipboard}
        >
          Colar lista da área de transferência
        </button>
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white"
          onClick={() => setModalDeletar((state) => !state)}
        >
          Limpar Lista
        </button>
      </div>
      {modalDeletar && (
        <div className="fixed top-6 flex flex-col gap-4 rounded-lg bg-white p-4 text-black">
          <span className="font-bold">
            Deseja mesmo reiniciar a lista de compras?
          </span>
          <div className="flex items-center justify-end gap-4">
            <button
              className="rounded-lg bg-gray-300 px-8 py-2 hover:bg-gray-300/50"
              onClick={(e) => {
                e.preventDefault();
                setModalDeletar(false);
              }}
            >
              Não
            </button>
            <button
              className="rounded-lg bg-red-600 px-8 py-2 text-white hover:bg-red-600/80"
              onClick={(e) => {
                e.preventDefault();
                setList([
                  { name: "Item", amount: 1, checked: false, value: 0 },
                ]);
                setModalDeletar(false);
              }}
            >
              Sim
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
