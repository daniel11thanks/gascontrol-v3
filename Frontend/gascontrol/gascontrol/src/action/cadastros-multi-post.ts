// src/action/cadastros-multi-post.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

interface GasometroSearchItem {
  id: number;
  codigo: string;
  apartamento: number;
  apartamento_info: string;
}

export async function cadastrosMultiPost(formData: FormData) {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  // 1. Condomínio
  const condValue = String(formData.get('condominio') || '');
  let condId: number;
  if (condValue === '__new__' || isNaN(Number(condValue))) {
    const condPayload = {
      nome: condValue,
      local: String(formData.get('condominio_local') || ''),
    };
    const condRes = await fetch('http://localhost:8000/api/condominios/', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(condPayload),
      cache: 'no-store',
    });
    if (!condRes.ok) {
      const txt = await condRes.text().catch(() => condRes.statusText);
      throw new Error(`Erro ao criar condomínio: ${txt}`);
    }
    condId = (await condRes.json()).id;
  } else {
    condId = Number(condValue);
  }

  // 2. Torre
  const creatingTorre = formData.get('creating_torre') === 'true';
  const torreValue = String(formData.get('torre') || '');
  const torreNumero = String(formData.get('torre_numero') || '').trim();
  const torreIdent = String(formData.get('torre_identificacao') || '').trim();
  let torreId: number;

  if (!creatingTorre && /^\d+$/.test(torreValue)) {
    torreId = Number(torreValue);
  } else if (creatingTorre && torreNumero && torreIdent) {
    const torrePayload = {
      numero: torreNumero,
      identificacao: torreIdent,
      condominio: condId,
    };
    const torreRes = await fetch('http://localhost:8000/api/torres/', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(torrePayload),
      cache: 'no-store',
    });
    if (!torreRes.ok) {
      const txt = await torreRes.text().catch(() => torreRes.statusText);
      console.warn(`Não foi possível criar torre: ${txt}`);
      torreId = NaN;
    } else {
      torreId = (await torreRes.json()).id;
    }
  } else {
    console.warn(
      'Nenhuma torre informada ou modo criação não ativado; pulando criação de apartamento.',
    );
    torreId = NaN;
  }

  // 3. Apartamento
  const creatingApartamento = formData.get('creating_apartamento') === 'true';
  let aptId: number = NaN;

  if (!isNaN(torreId)) {
    if (creatingApartamento) {
      // Criar novo apartamento
      const numeroApt = String(formData.get('apartamento_numero') || '');
      const aptPayload = { numero: numeroApt, torre: torreId };
      const aptRes = await fetch('http://localhost:8000/api/apartamentos/', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aptPayload),
        cache: 'no-store',
      });
      if (!aptRes.ok) {
        const txt = await aptRes.text().catch(() => aptRes.statusText);
        throw new Error(`Erro ao criar apartamento: ${txt}`);
      }
      aptId = (await aptRes.json()).id;
    } else {
      // Usar apartamento existente (selecionado no form)
      const aptSelected = String(formData.get('apartamento') || '');
      aptId = /^\d+$/.test(aptSelected) ? Number(aptSelected) : NaN;
    }
  } else {
    console.warn('Apartamento não criado pois torre inválida.');
  }

  // 4. Pessoa
  if (!isNaN(aptId)) {
    const pessoaPayload = {
      nome: String(formData.get('pessoa_nome') || ''),
      tipo: String(formData.get('pessoa_tipo') || ''),
      apartamento: aptId,
    };
    const pessoaRes = await fetch('http://localhost:8000/api/pessoas/', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pessoaPayload),
      cache: 'no-store',
    });
    if (!pessoaRes.ok) {
      const txt = await pessoaRes.text().catch(() => pessoaRes.statusText);
      throw new Error(`Erro ao criar pessoa: ${txt}`);
    }
  }
  console.log('Debug gasômetro/leitura:', {
    aptId,
    creatingGas: formData.get('creating_gasometro') === 'true',
    gasInput: String(
      formData.get('creating_gasometro') === 'true'
        ? formData.get('gasometro_codigo')
        : formData.get('gasometro'),
    ),
    data_leitura: formData.get('data_leitura'),
    consumo_m3: formData.get('consumo_m3'),
    periodicidade: formData.get('periodicidade'),
  });

  // 5. Gasômetro + Leitura
  if (!isNaN(aptId)) {
    const creatingGas = formData.get('creating_gasometro') === 'true';
    const gasInput = String(
      creatingGas
        ? formData.get('gasometro_codigo')
        : formData.get('gasometro'),
    );

    console.log(
      'GAS CREATE DEBUG -> aptId usado no payload:',
      aptId,
      'creatingGas:',
      creatingGas,
      'gasInput:',
      gasInput,
    );

    let gasId: number;

    if (!creatingGas) {
      gasId = Number(gasInput);
    } else {
      const gasPayload = { codigo: gasInput, apartamento: aptId };
      console.log('GAS CREATE DEBUG -> payload enviado:', gasPayload);

      const gasRes = await fetch('http://localhost:8000/api/gasometros/', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gasPayload),
      });
      const gasText = await gasRes.text().catch(() => '');
      console.log(
        'GAS CREATE DEBUG -> status:',
        gasRes.status,
        'ok:',
        gasRes.ok,
        'resBody:',
        gasText,
      );

      if (!gasRes.ok && gasText.includes('already exists')) {
        const searchRes = await fetch(
          `http://localhost:8000/api/gasometros/?codigo=${encodeURIComponent(
            gasInput,
          )}`,
          { headers: { Authorization: `Basic ${basic}` } },
        );
        console.log('>> searchRes.ok, status:', searchRes.ok, searchRes.status);
        const searchArray = (await searchRes
          .json()
          .catch(() => [])) as GasometroSearchItem[];
        console.log('>> searchRes.json():', searchArray);

        const found = searchArray.find((item) => item.codigo === gasInput);
        console.log('GAS SEARCH DEBUG -> found:', found);
        gasId = found ? found.id : NaN;
      } else if (gasRes.ok) {
        const gasJson = JSON.parse(gasText);
        console.log(
          '>> gasômetro criado:',
          gasJson,
          'apartamento retornado:',
          gasJson.apartamento,
        );
        gasId = gasJson.id;
      } else {
        throw new Error(`Erro ao criar gasômetro: ${gasText}`);
      }
    }

    console.log('>> Após criação/busca de gasômetro:', { gasId });

    // CONFIRMAÇÃO NO BACKEND: qual apartamento está associado ao gasômetro?
    if (!isNaN(gasId)) {
      const verifyRes = await fetch(
        `http://localhost:8000/api/gasometros/${gasId}/`,
        {
          headers: { Authorization: `Basic ${basic}` },
        },
      );
      const verifyTxt = await verifyRes.text().catch(() => '');
      console.log(
        'GAS VERIFY DEBUG -> GET gasometro:',
        verifyRes.status,
        verifyRes.ok,
        verifyTxt,
      );
      let verifyJson: {
        id: number;
        codigo: string;
        apartamento: number;
      } | null = null;
      try {
        verifyJson = JSON.parse(verifyTxt);
      } catch {}
      if (verifyJson) {
        console.log(
          'GAS VERIFY DEBUG -> apartamento no backend:',
          verifyJson.apartamento,
          'aptId enviado:',
          aptId,
        );
      }

      const leituraPayload = {
        data_leitura: String(formData.get('data_leitura') || ''),
        consumo_m3: Number(formData.get('consumo_m3')) || 0,
        periodicidade: String(formData.get('periodicidade') || ''),
        gasometro: gasId,
      };
      console.log('LEITURA CREATE DEBUG -> payload:', leituraPayload);

      const leituraRes = await fetch('http://localhost:8000/api/leituras/', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leituraPayload),
      });
      console.log(
        '>> leituraRes.ok, status:',
        leituraRes.ok,
        leituraRes.status,
      );
      if (!leituraRes.ok) {
        const txt = await leituraRes.text().catch(() => '');
        if (txt.includes('unique set')) {
          console.warn(
            `Leitura já existe para gasômetro ${gasId} em ${leituraPayload.data_leitura}`,
          );
        } else {
          throw new Error(`Erro ao criar leitura: ${txt}`);
        }
      }
    }
  }

  revalidatePath('/cadastros');
}
