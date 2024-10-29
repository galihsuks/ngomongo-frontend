"use client";

import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import Toast from "./Toast";

interface IAnggota {
    nama: string;
    email: string;
    _id: string;
}

interface NavbarAtasRoomProps {
    nama: string;
    anggota: IAnggota[];
    idRoom: string;
    bwhJudulProps: string;
}
const NavbarAtasRoom: React.FC<NavbarAtasRoomProps> = ({
    nama,
    anggota,
    idRoom,
    bwhJudulProps,
}) => {
    const [qrCode, setQrCode] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [openLeave, setOpenLeave] = useState(false);
    const [bwhJudul, setBwhJudul] = useState("Tekan disini untuk info grup");
    const bwhJudulAnggota = useRef("");

    const router = useRouter();
    const [value, setValue] = useState({
        email: "",
    });
    const [eror, setEror] = useState<string>("");

    function handleClick(e: SyntheticEvent) {
        setEror("");
        e.preventDefault();
        async function funFetchLogin() {
            const response = await fetch("/api/room/" + idRoom, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });

            const result = await response.json();

            if (response.status === 401) {
                return setEror(result.error);
            }
            router.refresh();
            setOpen(false);
        }
        funFetchLogin();
    }

    // function handleChange(e: React.FormEvent<HTMLInputElement>) {
    //     setValue({
    //         ...value,
    //         [e.currentTarget.name]: e.currentTarget.value,
    //     });
    // }

    useEffect(() => {
        const generateQRCode = async (text: string) => {
            try {
                const qrCodeUrl = await QRCode.toDataURL(text);
                setQrCode(qrCodeUrl);
            } catch (err) {
                console.error(err);
            }
        };
        generateQRCode(idRoom);

        const arrNamaAnggota = anggota.map((e) => {
            return e.nama.split(" ")[0];
        });
        bwhJudulAnggota.current = arrNamaAnggota.join(", ");
        setTimeout(() => {
            if (bwhJudul == "Tekan disini untuk info grup") {
                setBwhJudul(arrNamaAnggota.join(", "));
            }
        }, 3000);
    }, []);

    useEffect(() => {
        if (bwhJudulProps) return setBwhJudul(bwhJudulProps + " mengetik..");
        setBwhJudul(bwhJudulAnggota.current);
    }, [bwhJudulProps]);

    function openState() {
        setOpenLeave((prev) => !prev);
    }

    return (
        <div className="px-5 py-4 flex gap-2 navbar">
            <div
                onClick={() => {
                    setOpenInfo((prev) => !prev);
                }}
                style={{ flex: "1", cursor: "pointer" }}
                className="hover:text-indigo-600"
            >
                <h1 className="font-bold text-2xl">{nama}</h1>
                <p
                    className={
                        "text-sm " +
                        (bwhJudul.includes("mengetik")
                            ? "text-indigo-600"
                            : "text-gray-500")
                    }
                    style={{
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        fontWeight: bwhJudul.includes("mengetik")
                            ? "bold"
                            : "normal",
                    }}
                >
                    {bwhJudul}
                </p>
            </div>
            <div className="flex gap-1 items-center">
                <button
                    onClick={() => {
                        setOpen((prev) => !prev);
                    }}
                    className="flex w-full justify-center rounded-md p-1.5 text-sm font-semibold hover:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <i className="material-icons">add</i>
                </button>
                <button
                    onClick={() => {
                        setOpenLeave((prev) => !prev);
                    }}
                    className="flex w-full justify-center rounded-md p-1.5 text-sm font-semibold hover:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <i className="material-icons">exit_to_app</i>
                </button>
            </div>
            {openLeave && (
                <Toast
                    judul="Keluar room!"
                    subjudul={
                        "Apakah Anda akan keluar dan menghapus room " +
                        nama +
                        "?"
                    }
                    api={"/api/room/exit/" + idRoom}
                    callbackurl="/room"
                    openState={openState}
                />
            )}
            {open && (
                <div
                    className="modal"
                    onClick={() => {
                        setOpen((prev) => !prev);
                    }}
                >
                    <div
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        className="container-modal px-5 py-3 rounded-md"
                    >
                        <h1 className="font-bold text-lg">Tambah Anggota</h1>
                        <p className="text-gray-500 mb-4">
                            Scan disini untuk join
                        </p>
                        <div className="flex flex-col gap-1">
                            {qrCode && (
                                <img
                                    src={qrCode}
                                    alt="QR Code"
                                    width={"200px"}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
            {openInfo && (
                <div
                    className="modal"
                    onClick={() => {
                        setOpenInfo((prev) => !prev);
                    }}
                >
                    <div
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        className="container-modal px-5 py-3 rounded-md"
                    >
                        <h1 className="font-bold text-lg w-80">Info Room</h1>
                        <p className="text-gray-500 mb-4">Anggota</p>
                        <div className="flex flex-col gap-2">
                            {anggota.map((e: IAnggota, ind_e: number) => {
                                return (
                                    <div key={ind_e}>
                                        <p className="font-bold text-indigo-600">
                                            {e.nama}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {e.email}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavbarAtasRoom;
