import React, { useState } from "react";
import CardNotification from "./components/CardNotification";
import {
	ApiResponse,
	PlanningDetail,
	ResponseAdapter,
	SearchCriterion,
} from "./interface";
import IdentificationQuery from "./components/IdentificationQuery";

const Notifications: React.FC = () => {
	const [data, setData] = useState<ApiResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<string>("");
	const [is24HourFormat, setIs24HourFormat] = useState<boolean>(true);

	const identificationState = useState<string>("");
	const selectedCriterionState = useState<SearchCriterion>(SearchCriterion.ID);

	const toggleTimeFormat = () => {
		setIs24HourFormat(!is24HourFormat);
	};

	const fetchData = async (id: string, criterion: SearchCriterion) => {
		if (!id) return;

		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar/${id}/${criterion}`
			);
			if (!response.ok) {
				throw new Error("Error en la solicitud");
			}
			const result: ApiResponse = await response.json();

			if (result.resp === "ERROR") {
				setError(result.mensaje);
				setData(null);
			} else {
				setData(result);
				setActiveTab(result.notificaciones[0].cuentaContrato);
			}
		} catch (error) {
			setError((error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (id: string, criterion: SearchCriterion) => {
		fetchData(id, criterion);
	};

	function agruparPorFechaYCuenta(data: ApiResponse): ResponseAdapter {
		const agrupado: {
			[key: string]: {
				cuenta: string;
				detalles: PlanningDetail[];
				direccion: string;
				fechaRegistro: string;
				idUnidadNegocios: number;
			};
		} = {};

		data.notificaciones.forEach((notificacion) => {
			const {
				cuentaContrato,
				detallePlanificacion,
				direccion,
				fechaRegistro,
				idUnidadNegocios,
			} = notificacion;

			detallePlanificacion.forEach((detalle) => {
				const key = `${detalle.fechaCorte}-${cuentaContrato}`;

				if (!agrupado[key]) {
					agrupado[key] = {
						fechaRegistro,
						idUnidadNegocios,
						direccion,
						cuenta: cuentaContrato,
						detalles: [],
					};
				}
				agrupado[key].detalles.push(detalle);
			});
		});

		const notificaciones = Object.entries(agrupado).map(([_, value]) => ({
			fechaCorte: _.split("-")[0],
			cuentaContrato: value.cuenta,
			detalles: value.detalles,
			direccion: value.direccion,
			fechaRegistro: value.fechaRegistro,
			idUnidadNegocios: value.idUnidadNegocios,
		}));

		return {
			details: {
				idUnidadNegocios: data.notificaciones[0].idUnidadNegocios,
				cuentaContrato: data.notificaciones[0].cuentaContrato,
				alimentador: data.notificaciones[0].alimentador,
				cuen: data.notificaciones[0].cuen,
				direccion: data.notificaciones[0].direccion,
				fechaRegistro: data.notificaciones[0].fechaRegistro,
			},
			notificaciones: notificaciones,
		};
	}

	function filtrarPorNumeroContrato(
		notificaciones: ResponseAdapter,
		numeroContrato: string
	): ResponseAdapter {
		const filteredNotificaciones = notificaciones.notificaciones.filter(
			(n) => n.cuentaContrato === numeroContrato
		);

		return {
			details: notificaciones.details,
			notificaciones: filteredNotificaciones,
		};
	}

	const activeResultITem = data?.notificaciones
		? data?.notificaciones.filter(
				(item) => item.cuentaContrato === activeTab
		  )[0]
		: null;

	return (
		<>
			{loading ? (
				<div className='text-center text-gray-600'>Cargando...</div>
			) : (
				<div className='p-4 max-w-3xl mx-auto bg-white rounded-xl shadow-lg'>
					<IdentificationQuery
						identificationState={identificationState}
						selectedCriterionState={selectedCriterionState}
						handleSubmit={handleSubmit}
					/>
					{error && (
						<div
							className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
							role='alert'>
							<strong className='font-bold'>Error: </strong>
							<span className='block sm:inline'>{error}</span>
						</div>
					)}

					{data?.notificaciones && data.notificaciones.length > 1 ? (
						<div className='mx-auto '>
							<div className='flex border-b border-gray-300 gap-4 overflow-x-auto'>
								{data.notificaciones.map((notification) => {
									return (
										<button
											key={notification.cuentaContrato}
											onClick={() => setActiveTab(notification.cuentaContrato)}
											className={`flex-1 py-2 text-center font-semibold transition-colors duration-300 ${
												activeTab === notification.cuentaContrato
													? "border-b-2 border-blue-500 text-blue-500"
													: "text-gray-600 hover:text-blue-500"
											}`}>
											{notification.cuentaContrato}
											<br />
											<span className='text-xs'>
												({notification.direccion})
											</span>
										</button>
									);
								})}
							</div>
							<div className='mt-2 grid grid-cols-1 gap-2'>
								{activeResultITem &&
									activeResultITem.detallePlanificacion.length > 0 && (
										<button onClick={toggleTimeFormat} className='my-6'>
											Cambiar a{" "}
											<strong>
												{is24HourFormat ? "12 horas" : "24 horas"}
											</strong>
										</button>
									)}
								{activeResultITem &&
									activeResultITem.detallePlanificacion.length === 0 && (
										<div className='mt-4 text-center'>
											En espera de nueva programción de cortes de luz.
										</div>
									)}
								{filtrarPorNumeroContrato(
									agruparPorFechaYCuenta(data),
									activeTab
								).notificaciones.map((notification, index) => (
									<CardNotification
										key={index}
										detalles={notification.detalles}
										fechaCorte={notification.fechaCorte}
										is24HourFormat={is24HourFormat}
									/>
								))}
							</div>
						</div>
					) : (
						<>
							{data?.notificaciones && data.notificaciones.length > 0 ? (
								<div className='grid grid-cols-1 gap-2'>
									<div className='bg-gray-100 p-4 rounded-lg shadow-md mb-6'>
										<h2 className='text-xl font-semibold'>
											Unidad de Negocios:{" "}
											{agruparPorFechaYCuenta(data).details.idUnidadNegocios}
										</h2>
										<h3 className='text-lg'>
											Cuenta Contrato:{" "}
											{agruparPorFechaYCuenta(data).details.cuentaContrato}
										</h3>
										<h3 className='text-lg'>
											Dirección:{" "}
											{agruparPorFechaYCuenta(data).details.direccion}
										</h3>
										<h3 className='text-lg'>
											Fecha de Registro:{" "}
											{agruparPorFechaYCuenta(data).details.fechaRegistro}
										</h3>
									</div>
									<button onClick={toggleTimeFormat}>
										Cambiar a{" "}
										<strong>{is24HourFormat ? "12 horas" : "24 horas"}</strong>
									</button>
									{Object.entries(
										agruparPorFechaYCuenta(data).notificaciones
									).map(([index, notification]) => {
										return (
											<CardNotification
												key={index}
												detalles={notification.detalles}
												fechaCorte={notification.fechaCorte}
												is24HourFormat={is24HourFormat}
											/>
										);
									})}
								</div>
							) : (
								<>
									{data?.notificaciones && data?.notificaciones.length < 0 && (
										<p className='text-gray-600'>
											No hay notificaciones disponibles.
										</p>
									)}
								</>
							)}
						</>
					)}
				</div>
			)}
		</>
	);
};

export default Notifications;
