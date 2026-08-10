--
-- PostgreSQL database dump
--

\restrict WzmwqytaOkFaRR1M8sufEfTN7Z47Y8frv4w93o2L4lFBd7QLvVDOHA4C6xbKlpd

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ambulances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ambulances (
    id integer NOT NULL,
    source_road_id integer,
    source_road_name text,
    target_hospital_id integer,
    target_hospital_name text,
    status text DEFAULT 'active'::text,
    dispatched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resolved_at timestamp without time zone
);


ALTER TABLE public.ambulances OWNER TO postgres;

--
-- Name: ambulances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ambulances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ambulances_id_seq OWNER TO postgres;

--
-- Name: ambulances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ambulances_id_seq OWNED BY public.ambulances.id;


--
-- Name: hospitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospitals (
    id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    lat real,
    lng real,
    nearest_intersection_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.hospitals OWNER TO postgres;

--
-- Name: hospitals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospitals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospitals_id_seq OWNER TO postgres;

--
-- Name: hospitals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospitals_id_seq OWNED BY public.hospitals.id;


--
-- Name: intersections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intersections (
    id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    lat real DEFAULT 26.8467 NOT NULL,
    lng real DEFAULT 80.9462 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.intersections OWNER TO postgres;

--
-- Name: intersections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.intersections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.intersections_id_seq OWNER TO postgres;

--
-- Name: intersections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.intersections_id_seq OWNED BY public.intersections.id;


--
-- Name: roads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roads (
    id integer NOT NULL,
    name text NOT NULL,
    direction text,
    car_count integer DEFAULT 0,
    intersection_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.roads OWNER TO postgres;

--
-- Name: roads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roads_id_seq OWNER TO postgres;

--
-- Name: roads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roads_id_seq OWNED BY public.roads.id;


--
-- Name: signals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signals (
    id integer NOT NULL,
    road_id integer NOT NULL,
    intersection_id integer NOT NULL,
    state text DEFAULT 'red'::text NOT NULL,
    green_duration integer DEFAULT 30 NOT NULL,
    red_duration integer DEFAULT 60 NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.signals OWNER TO postgres;

--
-- Name: signals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.signals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.signals_id_seq OWNER TO postgres;

--
-- Name: signals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.signals_id_seq OWNED BY public.signals.id;


--
-- Name: ambulances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambulances ALTER COLUMN id SET DEFAULT nextval('public.ambulances_id_seq'::regclass);


--
-- Name: hospitals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals ALTER COLUMN id SET DEFAULT nextval('public.hospitals_id_seq'::regclass);


--
-- Name: intersections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intersections ALTER COLUMN id SET DEFAULT nextval('public.intersections_id_seq'::regclass);


--
-- Name: roads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roads ALTER COLUMN id SET DEFAULT nextval('public.roads_id_seq'::regclass);


--
-- Name: signals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signals ALTER COLUMN id SET DEFAULT nextval('public.signals_id_seq'::regclass);


--
-- Data for Name: ambulances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ambulances (id, source_road_id, source_road_name, target_hospital_id, target_hospital_name, status, dispatched_at, resolved_at) FROM stdin;
1	2	\N	2	\N	active	2026-05-03 18:25:32.708051	\N
2	2	\N	2	\N	active	2026-05-04 23:23:23.116012	\N
3	2	\N	2	\N	active	2026-05-04 23:39:17.430107	\N
\.


--
-- Data for Name: hospitals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospitals (id, name, location, lat, lng, nearest_intersection_id, created_at) FROM stdin;
1	King George Medical University	Charbagh	26.8657	80.9424	2	2026-05-03 17:18:02.434642
2	Lucknow Medical College	Lucknow	26.85	80.98	3	2026-05-03 17:18:02.435795
3	Balrampur Hospital	Gomti Nagar	26.84	80.99	3	2026-05-03 17:18:02.436238
4	Medanta Hospital	Lucknow	26.83	80.95	5	2026-05-03 17:18:02.436637
\.


--
-- Data for Name: intersections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.intersections (id, name, location, lat, lng, created_at) FROM stdin;
2	Charbagh	Railway Station Area	26.8657	80.9424	2026-05-03 17:18:02.423793
3	Gomti Nagar	East Lucknow	26.85	80.98	2026-05-03 17:18:02.424374
4	Aliganj	North Lucknow	26.87	80.93	2026-05-03 17:18:02.424813
5	Indira Nagar	South Lucknow	26.83	80.95	2026-05-03 17:18:02.425349
6	Alambagh	West Lucknow	26.84	80.91	2026-05-03 17:18:02.425831
1	Hazratganj	Central Lucknow	26.8467	80.9462	2026-05-03 17:18:02.420167
\.


--
-- Data for Name: roads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roads (id, name, direction, car_count, intersection_id, created_at) FROM stdin;
2	Charbagh Express	East-West	62	2	2026-05-03 17:18:02.427611
3	Gomti Nagar Avenue	North-South	38	3	2026-05-03 17:18:02.428073
4	Aliganj Road	East-West	55	4	2026-05-03 17:18:02.428522
5	Indira Nagar Link	North-South	42	5	2026-05-03 17:18:02.428935
6	Alambagh Bypass	East-West	70	6	2026-05-03 17:18:02.429305
7	Hazratganj Cross	East-West	50	1	2026-05-03 17:18:02.429663
8	Charbagh Link Road	North-South	48	2	2026-05-03 17:18:02.430004
1	Hazratganj Main Road	North-South	51	1	2026-05-03 17:18:02.426303
\.


--
-- Data for Name: signals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.signals (id, road_id, intersection_id, state, green_duration, red_duration, updated_at) FROM stdin;
2	2	2	green	72	48	2026-05-04 18:09:17.446
8	8	2	red	58	62	2026-05-04 18:09:17.45
3	3	3	green	120	10	2026-05-04 18:09:17.452
4	4	4	green	120	10	2026-05-04 18:09:17.453
5	5	5	green	120	10	2026-05-04 18:09:17.454
6	6	6	green	120	10	2026-05-04 18:09:17.455
7	7	1	red	64	56	2026-05-04 18:09:17.456
1	1	1	green	66	54	2026-05-04 18:09:17.456
\.


--
-- Name: ambulances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ambulances_id_seq', 3, true);


--
-- Name: hospitals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospitals_id_seq', 4, true);


--
-- Name: intersections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.intersections_id_seq', 6, true);


--
-- Name: roads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roads_id_seq', 8, true);


--
-- Name: signals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.signals_id_seq', 8, true);


--
-- Name: ambulances ambulances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambulances
    ADD CONSTRAINT ambulances_pkey PRIMARY KEY (id);


--
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);


--
-- Name: intersections intersections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intersections
    ADD CONSTRAINT intersections_pkey PRIMARY KEY (id);


--
-- Name: roads roads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roads
    ADD CONSTRAINT roads_pkey PRIMARY KEY (id);


--
-- Name: signals signals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signals
    ADD CONSTRAINT signals_pkey PRIMARY KEY (id);


--
-- Name: ambulances ambulances_source_road_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambulances
    ADD CONSTRAINT ambulances_source_road_id_fkey FOREIGN KEY (source_road_id) REFERENCES public.roads(id);


--
-- Name: ambulances ambulances_target_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambulances
    ADD CONSTRAINT ambulances_target_hospital_id_fkey FOREIGN KEY (target_hospital_id) REFERENCES public.hospitals(id);


--
-- Name: hospitals hospitals_nearest_intersection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_nearest_intersection_id_fkey FOREIGN KEY (nearest_intersection_id) REFERENCES public.intersections(id);


--
-- Name: roads roads_intersection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roads
    ADD CONSTRAINT roads_intersection_id_fkey FOREIGN KEY (intersection_id) REFERENCES public.intersections(id);


--
-- Name: signals signals_intersection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signals
    ADD CONSTRAINT signals_intersection_id_fkey FOREIGN KEY (intersection_id) REFERENCES public.intersections(id) ON DELETE CASCADE;


--
-- Name: signals signals_road_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signals
    ADD CONSTRAINT signals_road_id_fkey FOREIGN KEY (road_id) REFERENCES public.roads(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict WzmwqytaOkFaRR1M8sufEfTN7Z47Y8frv4w93o2L4lFBd7QLvVDOHA4C6xbKlpd

