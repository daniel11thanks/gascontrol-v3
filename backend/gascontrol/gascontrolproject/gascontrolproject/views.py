from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, filters, status
from gascontrolproject.models import Condominio, Torres, Apartamento, Pessoa, Gasometro, Leitura, Relatorio
from django_filters.rest_framework import DjangoFilterBackend
from gascontrolproject.serializer import CondominioSerializer, TorresSerializer, ApartamentoSerializer, PessoaSerializer, GasometroSerializer, LeituraSerializer, RelatorioSerializer
from django.db.models import Sum, Q
from rest_framework.decorators import action
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie



@ensure_csrf_cookie  # Isso garante que o token CSRF seja incluído
def registro_leituras_view(request): #pagina do registro de leituras 
    return render(request, 'leituras.html')


class CondominioViewSet(viewsets.ModelViewSet):
    queryset = Condominio.objects.all().order_by('?')
    serializer_class = CondominioSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['nome']
    search_fields = ['nome', 'local']
    


class TorresViewSet(viewsets.ModelViewSet):
    queryset = Torres.objects.all().order_by('?')
    serializer_class = TorresSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['identificacao']
    search_fields = ['identificacao']
    
    
class ApartamentoViewSet(viewsets.ModelViewSet):
    queryset = Apartamento.objects.all().order_by('?')
    serializer_class = ApartamentoSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['numero']
    search_fields = ['numero', 'torre']
    
class PessoaViewSet(viewsets.ModelViewSet):
    queryset = Pessoa.objects.all().order_by('?')
    serializer_class = PessoaSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['nome']
    search_fields = ['nome', 'tipo']

class GasometroViewSet(viewsets.ModelViewSet):
    queryset =  Gasometro.objects.all().order_by('?')
    serializer_class = GasometroSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['apartamentos']
    search_fields = ['codigo', 'apartamentos']

class LeituraViewSet(viewsets.ModelViewSet):
    queryset = Leitura.objects.all().order_by('?')
    serializer_class = LeituraSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['gasometros']
    search_fields = ['gasometros']


    def list(self, request): # TRATANDO ERROS
        queryset = self.filter_queryset(self.get_queryset())

        if not queryset.exists():
            return Response({"mensagem": "Nenhum destino foi encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    

# Geração de Relatórios a partir daqui

class RelatorioViewSet(viewsets.ModelViewSet):
    queryset = Relatorio.objects.all().order_by('?')
    serializer_class = RelatorioSerializer

    @action(detail=False, methods=['get'])
    def consumo_apartamento(self, request):  # Consumo por apartamento
        apartamento_id = request.query_params.get('apartamento_id')
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        if not all([apartamento_id, data_inicio, data_fim]):
            return Response({'error': 'Todos os parâmetros são obrigatórios'}, status=400)

        consumo = Leitura.objects.filter(
            gasometro__apartamento_id=apartamento_id,
            data_leitura__range=[data_inicio, data_fim]
        ).aggregate(total_consumo=Sum('consumo_m3'))
        
        return Response({
            'apartamento_id': apartamento_id,
            'periodo': f'{data_inicio} a {data_fim}',
            'total_consumo_m3': consumo['total_consumo'] or 0
        })
    
    @action(detail=False, methods=['get']) 
    def consumo_torre(self, request): # Consumo por torre
        torre_id = request.query_params.get('torre_id')
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        
        if not all([torre_id, data_inicio, data_fim]):
            return Response({'error': 'Todos os parâmetros são obrigatórios'}, status=400)
        
        consumo = Leitura.objects.filter(
            gasometro__apartamento__torre_id=torre_id,
            data_leitura__range=[data_inicio, data_fim]
        ).aggregate(total_consumo=Sum('consumo_m3'))
        
        return Response({
            'torre_id': torre_id,
            'periodo': f'{data_inicio} a {data_fim}',
            'total_consumo_m3': consumo['total_consumo'] or 0
        })
    
    @action(detail=False, methods=['get'])
    def consumo_condominio(self, request): # Consumo Geral do condominio
        condominio_id = request.query_params.get('condominio_id')
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        
        if not all([condominio_id, data_inicio, data_fim]):
            return Response({'error': 'Todos os parâmetros são obrigatórios'}, status=400)
        
        consumo = Leitura.objects.filter(
            gasometro__apartamento__torre__condominio_id=condominio_id,
            data_leitura__range=[data_inicio, data_fim]
        ).aggregate(total_consumo=Sum('consumo_m3')) 
        
        return Response({
            'condominio_id': condominio_id,
            'periodo': f'{data_inicio} a {data_fim}',
            'total_consumo_m3': consumo['total_consumo'] or 0
        })
    