import React, { useEffect, useState } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import * as S from "./styles";
import moment from "moment";
import Loader from "@/components/loader";
import rstruther from "@/infraestructure/http/nodeApi";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LogoSvg from "@/assets/logov2.svg";
import DatePickerModal from "@/components/datapicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { navigate } from "../../../../RootNavigation";

export default function Extract() {
  const navigation = useNavigation();
  const { navigate } = useNavigation();

  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() - 3);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [loading, setLoading] = useState(false);
  const [dataInicial, setDataInicial] = useState(formatDate(threeDaysLater));
  const [dataFinal, setDataFinal] = useState(formatDate(today));
  const [selectedStatus, setStatus] = useState("CONFIRMED");
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showInicialPicker, setShowInicialPicker] = useState(false);
  const [campoSelecionado, setCampoSelecionado] = useState(null);
  const [open, setOpen] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [listEnabled, setListEnabled] = useState(true);

  const [items, setItems] = useState([
    { label: "OPEN", value: "OPEN" },
    { label: "CANCEL", value: "CANCEL" },
    { label: "CONFIRMED", value: "CONFIRMED" },
  ]);

  const aplicarFiltro = () => {
    setInvoices([]);
    setPage(1);
    setHasMore(true);
    setFiltroAtivo(true);
  };

  const buscarFaturas = async (currentPage = 1) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await rstruther.get(`saller/invoice/list`, {
        params: {
          dateFrom: dataInicial,
          dateTo: dataFinal,
          status: selectedStatus,
          page: currentPage,
          limitPerPage: 3,
        },
      });

      const newInvoices = response.data.invoice;
      const pagination = response.data.pagination;

      setInvoices((prev) => [...prev, ...newInvoices]);

      const totalPages = Math.ceil(pagination.count / pagination.perPage);
      setHasMore(currentPage < totalPages);
      setPage(currentPage + 1);
    } catch (err) {
      console.error("Erro ao buscar invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filtroAtivo) {
      buscarFaturas(1);
      setFiltroAtivo(false);
    } else {
      buscarFaturas(1);
    }
  }, [filtroAtivo, selectedStatus, dataInicial, dataFinal]);

  const renderItem = ({ item }) => (
    <S.InvoiceItem>
      <S.TextContainer>
        <S.InvoiceText>ID: {item.id}</S.InvoiceText>
        <S.InvoiceText>Valor: {item.amount}</S.InvoiceText>
        <S.InvoiceText>Status: {item.status}</S.InvoiceText>
        <S.InvoiceText>
          Data: {moment(item.confirmDate).format("DD/MM/YYYY HH:mm")}
        </S.InvoiceText>
      </S.TextContainer>
      <S.IconContainer>
        {item.status === "CONFIRMED" && (
          <TouchableOpacity
            onPress={() => {
              navigate("proofExtract", { data: item });
            }}
          >
            <FontAwesome5 name="receipt" size={32} color="white" />
          </TouchableOpacity>
        )}
      </S.IconContainer>
    </S.InvoiceItem>
  );

  return (
    <S.Container>
      {loading && <Loader />}
      <S.Background source={require("@/assets/background.png")}>
        <StatusBar backgroundColor="transparent" translucent />
        <S.SafeArea>
          <S.Header>
            <S.BackButton
              onPress={() => {
                setListEnabled(false); // desmonta a lista
                setTimeout(() => {
                  navigation.goBack();
                }, 100); // espera um pouco antes de sair
              }}
            >
              <Ionicons name="arrow-back" size={32} color="white" />
            </S.BackButton>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(45)} height={hp(15)} />
          </S.cardLogo>

          <S.FilterDateArea>
            <TouchableOpacity
              onPress={() => {
                setCampoSelecionado("inicial");
                setShowInicialPicker(true);
              }}
            >
              <S.Input
                placeholder="Data Inicial"
                value={dataInicial}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setCampoSelecionado("final");
                setShowInicialPicker(true);
              }}
            >
              <S.Input
                placeholder="Data Final"
                value={dataFinal}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
          </S.FilterDateArea>

          <S.FilterArea>
            <S.cardDropDown>
              <DropDownPicker
                open={open}
                value={selectedStatus}
                items={items}
                setOpen={setOpen}
                setValue={setStatus}
                setItems={setItems}
              />
            </S.cardDropDown>

            <S.SearchButton onPress={aplicarFiltro}>
              <S.ButtonText>Filtrar</S.ButtonText>
            </S.SearchButton>
          </S.FilterArea>

          {listEnabled && (
            <FlatList
              data={invoices}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={() => buscarFaturas(page)}
              onEndReachedThreshold={0.1}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                loading ? <ActivityIndicator color="#fff" /> : null
              }
            />
          )}

          <DatePickerModal
            visible={showInicialPicker}
            selectedDate={
              campoSelecionado === "inicial" ? dataInicial : dataFinal
            }
            onClose={() => setShowInicialPicker(false)}
            onDateSelect={(date) => {
              if (campoSelecionado === "inicial") {
                setDataInicial(date);
              } else if (campoSelecionado === "final") {
                setDataFinal(date);
              }
              setCampoSelecionado(null);
              setShowInicialPicker(false);
            }}
          />
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}
